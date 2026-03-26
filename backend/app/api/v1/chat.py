"""Chat & conversation endpoints with persistent history, delete chat, and SSE streaming."""

from __future__ import annotations

import json
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import StreamingResponse
from sqlalchemy import delete, func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.database import get_db
from app.dependencies import get_current_user
from app.models.conversation import Conversation, Message
from app.models.user import User
from app.models.workspace import Workspace
from app.schemas.chat import (
    ChatHistoryResponse,
    ConversationCreate,
    ConversationListResponse,
    ConversationResponse,
    MessageCreate,
    MessageResponse,
)

router = APIRouter(tags=["Chat"])


# ── Helpers ──
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


async def _verify_conversation_access(
    conversation_id: str, user: User, db: AsyncSession
) -> Conversation:
    result = await db.execute(
        select(Conversation).where(
            Conversation.id == conversation_id, Conversation.user_id == user.id
        )
    )
    conv = result.scalar_one_or_none()
    if not conv:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Conversation not found"
        )
    return conv


async def _build_conversation_response(
    db: AsyncSession, conv: Conversation
) -> ConversationResponse:
    msg_count = (
        await db.execute(
            select(func.count(Message.id)).where(Message.conversation_id == conv.id)
        )
    ).scalar() or 0

    last_msg_result = await db.execute(
        select(Message.content)
        .where(Message.conversation_id == conv.id)
        .order_by(Message.created_at.desc())
        .limit(1)
    )
    last_msg = last_msg_result.scalar_one_or_none()

    return ConversationResponse(
        id=conv.id,
        workspace_id=conv.workspace_id,
        user_id=conv.user_id,
        title=conv.title,
        created_at=conv.created_at,
        updated_at=conv.updated_at,
        message_count=msg_count,
        last_message=last_msg[:100] if last_msg else None,
    )


# ── Conversation CRUD ──
@router.post(
    "/workspaces/{workspace_id}/conversations",
    response_model=ConversationResponse,
    status_code=status.HTTP_201_CREATED,
)
async def create_conversation(
    workspace_id: str,
    body: ConversationCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Start a new chat conversation in a workspace."""
    await _verify_workspace_access(workspace_id, current_user, db)

    conv = Conversation(
        workspace_id=workspace_id,
        user_id=current_user.id,
        title=body.title,
    )
    db.add(conv)
    await db.flush()
    return await _build_conversation_response(db, conv)


@router.get(
    "/workspaces/{workspace_id}/conversations",
    response_model=ConversationListResponse,
)
async def list_conversations(
    workspace_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """List all conversations in a workspace for the current user."""
    await _verify_workspace_access(workspace_id, current_user, db)

    result = await db.execute(
        select(Conversation)
        .where(
            Conversation.workspace_id == workspace_id,
            Conversation.user_id == current_user.id,
        )
        .order_by(Conversation.updated_at.desc())
    )
    convs = result.scalars().all()
    responses = [await _build_conversation_response(db, c) for c in convs]

    return ConversationListResponse(conversations=responses, total=len(responses))


@router.get(
    "/conversations/{conversation_id}",
    response_model=ChatHistoryResponse,
)
async def get_conversation_history(
    conversation_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get full chat history for a conversation."""
    conv = await _verify_conversation_access(conversation_id, current_user, db)
    conv_response = await _build_conversation_response(db, conv)

    result = await db.execute(
        select(Message)
        .where(Message.conversation_id == conversation_id)
        .order_by(Message.created_at.asc())
    )
    messages = result.scalars().all()

    return ChatHistoryResponse(
        conversation=conv_response,
        messages=[MessageResponse.model_validate(m) for m in messages],
    )


# ── Delete single conversation ──
@router.delete(
    "/conversations/{conversation_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
async def delete_conversation(
    conversation_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Delete a single conversation and all its messages."""
    conv = await _verify_conversation_access(conversation_id, current_user, db)
    await db.delete(conv)  # cascade deletes messages


# ── Delete ALL conversations in a workspace (clear chat history) ──
@router.delete(
    "/workspaces/{workspace_id}/conversations",
    status_code=status.HTTP_204_NO_CONTENT,
)
async def delete_all_conversations(
    workspace_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Delete all conversations for the current user in a workspace (clear chat history)."""
    await _verify_workspace_access(workspace_id, current_user, db)

    await db.execute(
        delete(Conversation).where(
            Conversation.workspace_id == workspace_id,
            Conversation.user_id == current_user.id,
        )
    )


# ── Delete a single message ──
@router.delete(
    "/messages/{message_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
async def delete_message(
    message_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Delete a single message from a conversation."""
    result = await db.execute(select(Message).where(Message.id == message_id))
    msg = result.scalar_one_or_none()
    if not msg:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Message not found")

    # Verify ownership
    await _verify_conversation_access(msg.conversation_id, current_user, db)
    await db.delete(msg)


# ── Send a message (RAG-powered response) ──
@router.post(
    "/conversations/{conversation_id}/messages",
    response_model=MessageResponse,
)
async def send_message(
    conversation_id: str,
    body: MessageCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Send a message and get an AI response using RAG."""
    conv = await _verify_conversation_access(conversation_id, current_user, db)

    # Save user message
    user_msg = Message(
        conversation_id=conversation_id,
        role="user",
        content=body.content,
    )
    db.add(user_msg)
    await db.flush()

    # Update conversation title from first user message
    msg_count = (
        await db.execute(
            select(func.count(Message.id)).where(
                Message.conversation_id == conversation_id,
                Message.role == "user",
            )
        )
    ).scalar() or 0

    if msg_count == 1:
        conv.title = body.content[:100]
        await db.flush()

    # Generate AI response using RAG pipeline
    try:
        from app.services.rag_pipeline import generate_rag_response

        # Get previous messages for context
        prev_result = await db.execute(
            select(Message)
            .where(Message.conversation_id == conversation_id)
            .order_by(Message.created_at.asc())
        )
        prev_messages = prev_result.scalars().all()
        chat_history = [{"role": m.role, "content": m.content} for m in prev_messages]

        response_content, source_refs, token_count = await generate_rag_response(
            query=body.content,
            workspace_id=conv.workspace_id,
            chat_history=chat_history,
            db=db,
        )
    except Exception as e:
        response_content = f"I apologize, but I encountered an error processing your request. Please try again. Error: {str(e)}"
        source_refs = None
        token_count = 0

    # Save assistant message
    assistant_msg = Message(
        conversation_id=conversation_id,
        role="assistant",
        content=response_content,
        source_refs=json.dumps(source_refs) if source_refs else None,
        token_count=token_count,
    )
    db.add(assistant_msg)
    await db.flush()

    # Update conversation timestamp
    conv.updated_at = datetime.now(timezone.utc)
    await db.flush()

    return assistant_msg


# ── SSE Streaming endpoint ──
@router.post("/conversations/{conversation_id}/messages/stream")
async def stream_message(
    conversation_id: str,
    body: MessageCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Send a message and stream the AI response via SSE."""
    conv = await _verify_conversation_access(conversation_id, current_user, db)

    # Save user message
    user_msg = Message(
        conversation_id=conversation_id,
        role="user",
        content=body.content,
    )
    db.add(user_msg)
    await db.flush()

    async def event_generator():
        full_response = ""
        try:
            from app.services.rag_pipeline import generate_rag_response_stream

            prev_result = await db.execute(
                select(Message)
                .where(Message.conversation_id == conversation_id)
                .order_by(Message.created_at.asc())
            )
            prev_messages = prev_result.scalars().all()
            chat_history = [{"role": m.role, "content": m.content} for m in prev_messages]

            async for chunk in generate_rag_response_stream(
                query=body.content,
                workspace_id=conv.workspace_id,
                chat_history=chat_history,
                db=db,
            ):
                full_response += chunk
                yield f"data: {json.dumps({'content': chunk})}\n\n"

        except Exception as e:
            error_msg = f"Error: {str(e)}"
            full_response = error_msg
            yield f"data: {json.dumps({'content': error_msg, 'error': True})}\n\n"

        # Save the full assistant response
        assistant_msg = Message(
            conversation_id=conversation_id,
            role="assistant",
            content=full_response,
        )
        db.add(assistant_msg)
        conv.updated_at = datetime.now(timezone.utc)
        await db.flush()

        yield f"data: {json.dumps({'done': True})}\n\n"

    return StreamingResponse(event_generator(), media_type="text/event-stream")
