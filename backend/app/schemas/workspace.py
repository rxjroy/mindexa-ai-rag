"""Workspace schemas."""

from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel, Field


class WorkspaceCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    description: str = ""


class WorkspaceUpdate(BaseModel):
    name: str | None = None
    description: str | None = None


class WorkspaceResponse(BaseModel):
    id: str
    name: str
    description: str
    owner_id: str
    created_at: datetime
    document_count: int = 0
    conversation_count: int = 0

    model_config = {"from_attributes": True}
