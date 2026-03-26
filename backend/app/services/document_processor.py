"""Document text extraction, chunking, and processing pipeline."""

from __future__ import annotations

import os
import re
from dataclasses import dataclass, field
from typing import List

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.document import Document, DocumentChunk


@dataclass
class TextChunk:
    """A chunk of text with metadata."""
    content: str
    chunk_index: int
    page_number: int | None = None
    metadata: dict = field(default_factory=dict)


def extract_text_from_pdf(file_path: str) -> list[tuple[int, str]]:
    """Extract text from PDF, returns list of (page_number, text)."""
    from pypdf import PdfReader

    reader = PdfReader(file_path)
    pages = []
    for i, page in enumerate(reader.pages):
        text = page.extract_text() or ""
        if text.strip():
            pages.append((i + 1, text))
    return pages


def extract_text_from_docx(file_path: str) -> list[tuple[int, str]]:
    """Extract text from DOCX, returns list of (page_number, text)."""
    from docx import Document as DocxDocument

    doc = DocxDocument(file_path)
    full_text = "\n".join(p.text for p in doc.paragraphs if p.text.strip())
    if full_text.strip():
        return [(1, full_text)]
    return []


def extract_text_from_txt(file_path: str) -> list[tuple[int, str]]:
    """Extract text from plain text file."""
    with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
        content = f.read()
    if content.strip():
        return [(1, content)]
    return []


EXTRACTORS = {
    "application/pdf": extract_text_from_pdf,
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": extract_text_from_docx,
    "text/plain": extract_text_from_txt,
}


def chunk_text(
    text: str,
    chunk_size: int = 512,
    chunk_overlap: int = 50,
    page_number: int | None = None,
) -> List[TextChunk]:
    """
    Hybrid chunking: first split by semantic boundaries (paragraphs/sections),
    then apply fixed-size chunking with overlap as fallback.
    """
    chunks: List[TextChunk] = []

    # Step 1: Split by semantic boundaries (double newlines = paragraphs)
    paragraphs = re.split(r"\n\s*\n", text)
    paragraphs = [p.strip() for p in paragraphs if p.strip()]

    current_chunk = ""
    chunk_index = 0

    for paragraph in paragraphs:
        # If adding this paragraph keeps us under chunk_size, accumulate
        if len(current_chunk) + len(paragraph) + 1 <= chunk_size:
            current_chunk = (current_chunk + "\n\n" + paragraph).strip() if current_chunk else paragraph
        else:
            # Save current accumulated chunk
            if current_chunk:
                chunks.append(
                    TextChunk(
                        content=current_chunk,
                        chunk_index=chunk_index,
                        page_number=page_number,
                    )
                )
                chunk_index += 1

            # If single paragraph is too long, split it with overlap
            if len(paragraph) > chunk_size:
                words = paragraph.split()
                sub_chunk = ""
                for word in words:
                    if len(sub_chunk) + len(word) + 1 <= chunk_size:
                        sub_chunk = (sub_chunk + " " + word).strip() if sub_chunk else word
                    else:
                        if sub_chunk:
                            chunks.append(
                                TextChunk(
                                    content=sub_chunk,
                                    chunk_index=chunk_index,
                                    page_number=page_number,
                                )
                            )
                            chunk_index += 1
                            # Keep overlap
                            overlap_words = sub_chunk.split()[-chunk_overlap:]
                            sub_chunk = " ".join(overlap_words) + " " + word
                        else:
                            sub_chunk = word
                if sub_chunk:
                    chunks.append(
                        TextChunk(
                            content=sub_chunk,
                            chunk_index=chunk_index,
                            page_number=page_number,
                        )
                    )
                    chunk_index += 1
                current_chunk = ""
            else:
                current_chunk = paragraph

    # Don't forget the last accumulated chunk
    if current_chunk:
        chunks.append(
            TextChunk(
                content=current_chunk,
                chunk_index=chunk_index,
                page_number=page_number,
            )
        )

    return chunks


async def process_document_sync(document_id: str, db: AsyncSession) -> None:
    """
    Full document processing pipeline:
    1. Extract text
    2. Chunk
    3. Generate embeddings
    4. Store in vector DB
    5. Update document status
    """
    result = await db.execute(select(Document).where(Document.id == document_id))
    doc = result.scalar_one_or_none()
    if not doc:
        raise ValueError(f"Document {document_id} not found")

    doc.status = "processing"
    await db.flush()

    try:
        # Extract text
        extractor = EXTRACTORS.get(doc.content_type)
        if not extractor:
            raise ValueError(f"No extractor for content type: {doc.content_type}")

        pages = extractor(doc.file_path)
        if not pages:
            raise ValueError("No text could be extracted from the document")

        # Chunk all pages
        all_chunks: List[TextChunk] = []
        for page_num, page_text in pages:
            page_chunks = chunk_text(page_text, page_number=page_num)
            all_chunks.extend(page_chunks)

        # Re-index chunks
        for i, chunk in enumerate(all_chunks):
            chunk.chunk_index = i

        # Store chunks in PostgreSQL
        db_chunks = []
        for chunk in all_chunks:
            db_chunk = DocumentChunk(
                document_id=doc.id,
                chunk_index=chunk.chunk_index,
                content=chunk.content,
                page_number=chunk.page_number,
            )
            db.add(db_chunk)
            db_chunks.append(db_chunk)

        await db.flush()

        # Generate embeddings and store in vector DB
        try:
            from app.services.embeddings import get_embedding_provider
            from app.services.vector_store import get_vector_store

            embedder = get_embedding_provider()
            vs = get_vector_store()

            texts = [c.content for c in all_chunks]
            embeddings = await embedder.embed_batch(texts)

            ids = [c.id for c in db_chunks]
            metadatas = [
                {
                    "document_id": doc.id,
                    "workspace_id": doc.workspace_id,
                    "chunk_index": c.chunk_index,
                    "page_number": c.page_number or 0,
                    "filename": doc.filename,
                }
                for c in all_chunks
            ]

            vs.add_chunks(
                ids=ids,
                texts=texts,
                embeddings=embeddings,
                metadatas=metadatas,
                workspace_id=doc.workspace_id,
            )

            # Update embedding_ids
            for db_chunk, chunk_id in zip(db_chunks, ids):
                db_chunk.embedding_id = chunk_id

        except Exception as embed_err:
            # Embedding/vector store failure is non-fatal for chunk storage
            doc.error_message = f"Chunks saved but embedding failed: {str(embed_err)}"

        doc.chunk_count = len(all_chunks)
        doc.status = "ready"
        await db.flush()

    except Exception as e:
        doc.status = "failed"
        doc.error_message = str(e)
        await db.flush()
        raise
