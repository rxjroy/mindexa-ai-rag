"""Chat / conversation schemas."""

from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel, Field


# ── Requests ──
class ConversationCreate(BaseModel):
    title: str = "New Chat"


class MessageCreate(BaseModel):
    content: str = Field(..., min_length=1, max_length=10000)


# ── Responses ──
class MessageResponse(BaseModel):
    id: str
    conversation_id: str
    role: str
    content: str
    source_refs: str | None = None
    token_count: int = 0
    created_at: datetime

    model_config = {"from_attributes": True}


class ConversationResponse(BaseModel):
    id: str
    workspace_id: str
    user_id: str
    title: str
    created_at: datetime
    updated_at: datetime
    message_count: int = 0
    last_message: str | None = None

    model_config = {"from_attributes": True}


class ConversationListResponse(BaseModel):
    conversations: list[ConversationResponse]
    total: int


class ChatHistoryResponse(BaseModel):
    conversation: ConversationResponse
    messages: list[MessageResponse]
