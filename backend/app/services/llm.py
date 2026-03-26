"""LLM provider abstraction with prompt templating and retry logic."""

from __future__ import annotations

import asyncio
from abc import ABC, abstractmethod
from typing import AsyncIterator, List

from app.config import settings


# ── Prompt Templates ──
SYSTEM_PROMPT = """You are Mindexa AI, an intelligent document analysis assistant.
You help users understand, analyze, and extract insights from their documents.

Guidelines:
- Answer questions based primarily on the provided document context
- If the context doesn't contain enough information, say so honestly
- Reference specific pages/sections when possible
- Be concise but thorough
- Use markdown formatting for better readability"""

RAG_USER_PROMPT = """Based on the following document context, answer the user's question.

DOCUMENT CONTEXT:
{context}

CHAT HISTORY:
{chat_history}

USER QUESTION: {query}

Provide a helpful, accurate answer based on the document context. If the context doesn't fully address the question, mention what information is available and what might be missing."""

NO_CONTEXT_PROMPT = """The user has asked a question but no relevant document context was found in their workspace.

CHAT HISTORY:
{chat_history}

USER QUESTION: {query}

Let the user know that you couldn't find relevant information in their uploaded documents. Suggest they upload relevant documents or rephrase their question."""


class LLMProvider(ABC):
    @abstractmethod
    async def generate(
        self,
        messages: List[dict],
        max_tokens: int = 1024,
        temperature: float = 0.7,
    ) -> tuple[str, int]:
        """Generate a response. Returns (response_text, token_count)."""
        ...

    @abstractmethod
    async def generate_stream(
        self,
        messages: List[dict],
        max_tokens: int = 1024,
        temperature: float = 0.7,
    ) -> AsyncIterator[str]:
        """Stream response chunks."""
        ...


class OpenAIProvider(LLMProvider):
    def __init__(self):
        from openai import AsyncOpenAI

        self.client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)
        self.model = settings.LLM_MODEL

    async def generate(
        self,
        messages: List[dict],
        max_tokens: int = 1024,
        temperature: float = 0.7,
    ) -> tuple[str, int]:
        """Generate with retry and exponential backoff."""
        max_retries = 3
        for attempt in range(max_retries):
            try:
                response = await self.client.chat.completions.create(
                    model=self.model,
                    messages=messages,
                    max_tokens=max_tokens,
                    temperature=temperature,
                )
                content = response.choices[0].message.content or ""
                total_tokens = response.usage.total_tokens if response.usage else 0
                return content, total_tokens
            except Exception as e:
                if attempt == max_retries - 1:
                    raise
                wait_time = 2 ** attempt
                await asyncio.sleep(wait_time)

        return "", 0

    async def generate_stream(
        self,
        messages: List[dict],
        max_tokens: int = 1024,
        temperature: float = 0.7,
    ) -> AsyncIterator[str]:
        """Stream response with retry."""
        try:
            stream = await self.client.chat.completions.create(
                model=self.model,
                messages=messages,
                max_tokens=max_tokens,
                temperature=temperature,
                stream=True,
            )
            async for chunk in stream:
                if chunk.choices and chunk.choices[0].delta.content:
                    yield chunk.choices[0].delta.content
        except Exception as e:
            yield f"\n\n[Error generating response: {str(e)}]"


_provider: LLMProvider | None = None


def get_llm_provider() -> LLMProvider:
    global _provider
    if _provider is None:
        _provider = OpenAIProvider()
    return _provider
