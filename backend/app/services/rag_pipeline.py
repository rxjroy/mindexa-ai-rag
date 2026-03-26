"""RAG pipeline – orchestrates retrieval and generation."""

from __future__ import annotations

from typing import AsyncIterator, List

from sqlalchemy.ext.asyncio import AsyncSession

from app.services.llm import (
    NO_CONTEXT_PROMPT,
    RAG_USER_PROMPT,
    SYSTEM_PROMPT,
    get_llm_provider,
)
from app.services.retriever import retrieve_context


def _format_chat_history(chat_history: List[dict], limit: int = 10) -> str:
    """Format recent chat history for the prompt."""
    if not chat_history:
        return "No previous messages."

    recent = chat_history[-limit:]
    lines = []
    for msg in recent:
        role = "User" if msg["role"] == "user" else "Assistant"
        content = msg["content"][:200]  # Truncate long messages
        lines.append(f"{role}: {content}")
    return "\n".join(lines)


async def generate_rag_response(
    query: str,
    workspace_id: str,
    chat_history: List[dict],
    db: AsyncSession,
) -> tuple[str, list[dict] | None, int]:
    """
    Full RAG pipeline:
    1. Retrieve relevant context from vector store
    2. Build prompt with context + chat history
    3. Generate response via LLM
    
    Returns (response_text, source_refs, token_count)
    """
    llm = get_llm_provider()

    # Retrieve context
    context, source_refs = await retrieve_context(
        query=query,
        workspace_id=workspace_id,
        top_k=5,
        db=db,
    )

    history_str = _format_chat_history(chat_history)

    # Build messages
    messages = [{"role": "system", "content": SYSTEM_PROMPT}]

    if context:
        user_content = RAG_USER_PROMPT.format(
            context=context,
            chat_history=history_str,
            query=query,
        )
    else:
        user_content = NO_CONTEXT_PROMPT.format(
            chat_history=history_str,
            query=query,
        )
        source_refs = None

    messages.append({"role": "user", "content": user_content})

    # Generate
    response_text, token_count = await llm.generate(messages)

    return response_text, source_refs, token_count


async def generate_rag_response_stream(
    query: str,
    workspace_id: str,
    chat_history: List[dict],
    db: AsyncSession,
) -> AsyncIterator[str]:
    """
    Streaming RAG pipeline.
    """
    llm = get_llm_provider()

    # Retrieve context
    context, source_refs = await retrieve_context(
        query=query,
        workspace_id=workspace_id,
        top_k=5,
        db=db,
    )

    history_str = _format_chat_history(chat_history)

    messages = [{"role": "system", "content": SYSTEM_PROMPT}]

    if context:
        user_content = RAG_USER_PROMPT.format(
            context=context,
            chat_history=history_str,
            query=query,
        )
    else:
        user_content = NO_CONTEXT_PROMPT.format(
            chat_history=history_str,
            query=query,
        )

    messages.append({"role": "user", "content": user_content})

    async for chunk in llm.generate_stream(messages):
        yield chunk
