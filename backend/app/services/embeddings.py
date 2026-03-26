"""Embedding provider abstraction – OpenAI and HuggingFace."""

from __future__ import annotations

from abc import ABC, abstractmethod
from typing import List

from app.config import settings


class EmbeddingProvider(ABC):
    @abstractmethod
    async def embed(self, text: str) -> List[float]:
        ...

    @abstractmethod
    async def embed_batch(self, texts: List[str]) -> List[List[float]]:
        ...


class OpenAIEmbeddings(EmbeddingProvider):
    def __init__(self):
        from openai import AsyncOpenAI

        self.client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)
        self.model = settings.EMBEDDING_MODEL

    async def embed(self, text: str) -> List[float]:
        response = await self.client.embeddings.create(
            input=text, model=self.model
        )
        return response.data[0].embedding

    async def embed_batch(self, texts: List[str]) -> List[List[float]]:
        if not texts:
            return []
        # OpenAI supports batch embedding natively (up to 2048 inputs)
        batch_size = 100
        all_embeddings = []
        for i in range(0, len(texts), batch_size):
            batch = texts[i : i + batch_size]
            response = await self.client.embeddings.create(
                input=batch, model=self.model
            )
            all_embeddings.extend([d.embedding for d in response.data])
        return all_embeddings


class HuggingFaceEmbeddings(EmbeddingProvider):
    def __init__(self):
        from sentence_transformers import SentenceTransformer

        self.model = SentenceTransformer("all-MiniLM-L6-v2")

    async def embed(self, text: str) -> List[float]:
        embedding = self.model.encode(text)
        return embedding.tolist()

    async def embed_batch(self, texts: List[str]) -> List[List[float]]:
        if not texts:
            return []
        embeddings = self.model.encode(texts, batch_size=32)
        return [e.tolist() for e in embeddings]


_provider: EmbeddingProvider | None = None


def get_embedding_provider() -> EmbeddingProvider:
    global _provider
    if _provider is None:
        if settings.EMBEDDING_PROVIDER == "huggingface":
            _provider = HuggingFaceEmbeddings()
        else:
            _provider = OpenAIEmbeddings()
    return _provider
