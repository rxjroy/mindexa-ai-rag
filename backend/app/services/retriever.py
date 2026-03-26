"""Semantic search retriever – queries vector store and builds context."""

from __future__ import annotations

from typing import List

from sqlalchemy.ext.asyncio import AsyncSession

from app.services.embeddings import get_embedding_provider
from app.services.vector_store import get_vector_store


async def retrieve_context(
    query: str,
    workspace_id: str,
    top_k: int = 5,
    db: AsyncSession | None = None,
) -> tuple[str, list[dict]]:
    """
    Given a user query:
    1. Generate query embedding
    2. Search vector store for similar chunks
    3. Build a context string with source references

    Returns (context_string, source_references)
    """
    embedder = get_embedding_provider()
    vs = get_vector_store()

    # Generate query embedding
    query_embedding = await embedder.embed(query)

    # Search
    results = vs.search(
        query_embedding=query_embedding,
        workspace_id=workspace_id,
        top_k=top_k,
    )

    if not results:
        return "", []

    # Build context
    context_parts: List[str] = []
    source_refs: List[dict] = []

    for i, hit in enumerate(results):
        metadata = hit.get("metadata", {})
        content = hit.get("content", "")
        filename = metadata.get("filename", "Unknown")
        page_num = metadata.get("page_number", 0)

        context_parts.append(
            f"[Source {i + 1}: {filename}, Page {page_num}]\n{content}"
        )
        source_refs.append(
            {
                "chunk_id": hit["id"],
                "filename": filename,
                "page_number": page_num,
                "relevance": round(1 - hit.get("distance", 1.0), 3),
            }
        )

    context_string = "\n\n---\n\n".join(context_parts)
    return context_string, source_refs
