"""Document upload & management endpoints."""

from __future__ import annotations

import os
import uuid
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import settings
from app.database import get_db
from app.dependencies import get_current_user
from app.models.document import Document
from app.models.user import User
from app.models.workspace import Workspace
from app.schemas.document import DocumentListResponse, DocumentResponse

router = APIRouter(tags=["Documents"])

ALLOWED_CONTENT_TYPES = {
    "application/pdf": ".pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": ".docx",
    "text/plain": ".txt",
}


async def _verify_workspace_access(
    workspace_id: str, user: User, db: AsyncSession
) -> Workspace:
    result = await db.execute(
        select(Workspace).where(
            Workspace.id == workspace_id, Workspace.owner_id == user.id
        )
    )
    ws = result.scalar_one_or_none()
    if not ws:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Workspace not found")
    return ws


@router.post(
    "/workspaces/{workspace_id}/documents",
    response_model=DocumentResponse,
    status_code=status.HTTP_201_CREATED,
)
async def upload_document(
    workspace_id: str,
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Upload a document (PDF, DOCX, TXT) to a workspace."""
    await _verify_workspace_access(workspace_id, current_user, db)

    # Validate content type
    content_type = file.content_type or "application/octet-stream"
    if content_type not in ALLOWED_CONTENT_TYPES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported file type: {content_type}. Allowed: PDF, DOCX, TXT",
        )

    # Read file
    file_bytes = await file.read()
    file_size = len(file_bytes)

    # Save to local storage
    upload_dir = os.path.join(settings.UPLOAD_DIR, workspace_id)
    os.makedirs(upload_dir, exist_ok=True)
    file_id = str(uuid.uuid4())
    ext = ALLOWED_CONTENT_TYPES.get(content_type, "")
    safe_filename = f"{file_id}{ext}"
    file_path = os.path.join(upload_dir, safe_filename)

    with open(file_path, "wb") as f:
        f.write(file_bytes)

    # Create DB record
    doc = Document(
        workspace_id=workspace_id,
        filename=file.filename or "untitled",
        file_path=file_path,
        file_size=file_size,
        content_type=content_type,
        status="pending",
    )
    db.add(doc)
    await db.flush()

    # Trigger background processing
    try:
        from app.services.document_processor import process_document_sync
        await process_document_sync(doc.id, db)
    except Exception as e:
        doc.status = "failed"
        doc.error_message = str(e)
        await db.flush()

    # Refresh to get updated status
    await db.refresh(doc)
    return doc


@router.get(
    "/workspaces/{workspace_id}/documents",
    response_model=DocumentListResponse,
)
async def list_documents(
    workspace_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """List all documents in a workspace."""
    await _verify_workspace_access(workspace_id, current_user, db)

    result = await db.execute(
        select(Document)
        .where(Document.workspace_id == workspace_id)
        .order_by(Document.created_at.desc())
    )
    docs = result.scalars().all()

    total = (
        await db.execute(
            select(func.count(Document.id)).where(Document.workspace_id == workspace_id)
        )
    ).scalar() or 0

    return DocumentListResponse(documents=list(docs), total=total)


@router.get("/documents/{document_id}", response_model=DocumentResponse)
async def get_document(
    document_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get document details."""
    result = await db.execute(select(Document).where(Document.id == document_id))
    doc = result.scalar_one_or_none()
    if not doc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Document not found")

    # Verify ownership through workspace
    await _verify_workspace_access(doc.workspace_id, current_user, db)
    return doc


@router.delete("/documents/{document_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_document(
    document_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Delete a document and its chunks."""
    result = await db.execute(select(Document).where(Document.id == document_id))
    doc = result.scalar_one_or_none()
    if not doc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Document not found")

    await _verify_workspace_access(doc.workspace_id, current_user, db)

    # Delete file from storage
    if os.path.exists(doc.file_path):
        os.remove(doc.file_path)

    # Delete from vector store
    try:
        from app.services.vector_store import get_vector_store
        vs = get_vector_store()
        vs.delete_by_document(document_id)
    except Exception:
        pass  # Non-critical if vector cleanup fails

    await db.delete(doc)


@router.post("/documents/{document_id}/reprocess", response_model=DocumentResponse)
async def reprocess_document(
    document_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Trigger re-processing of a document."""
    result = await db.execute(select(Document).where(Document.id == document_id))
    doc = result.scalar_one_or_none()
    if not doc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Document not found")

    await _verify_workspace_access(doc.workspace_id, current_user, db)

    doc.status = "pending"
    doc.error_message = None
    doc.chunk_count = 0
    await db.flush()

    try:
        from app.services.document_processor import process_document_sync
        await process_document_sync(doc.id, db)
    except Exception as e:
        doc.status = "failed"
        doc.error_message = str(e)
        await db.flush()

    await db.refresh(doc)
    return doc
