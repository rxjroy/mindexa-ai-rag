"""ChromaDB vector store integration."""

from __future__ import annotations

import os
from typing import List

import chromadb
from chromadb.config import Settings as ChromaSettings

from app.config import settings

_client: chromadb.ClientAPI | None = None


class VectorStore:
    """Wrapper around ChromaDB for document chunk storage and retrieval."""

    def __init__(self, client: chromadb.ClientAPI):
        self.client = client

    def _get_collection(self, workspace_id: str) -> chromadb.Collection:
        """Get or create a collection per workspace."""
        return self.client.get_or_create_collection(
            name=f"workspace_{workspace_id}",
            metadata={"hnsw:space": "cosine"},
        )

    def add_chunks(
        self,
        ids: List[str],
        texts: List[str],
        embeddings: List[List[float]],
        metadatas: List[dict],
        workspace_id: str,
    ) -> None:
        """Add document chunks with embeddings to the vector store."""
        collection = self._get_collection(workspace_id)
        collection.add(
            ids=ids,
            documents=texts,
            embeddings=embeddings,
            metadatas=metadatas,
        )

    def search(
        self,
        query_embedding: List[float],
        workspace_id: str,
        top_k: int = 5,
        filter_metadata: dict | None = None,
    ) -> list[dict]:
        """Perform semantic search and return top-K results."""
        collection = self._get_collection(workspace_id)

        where = filter_metadata if filter_metadata else None

        results = collection.query(
            query_embeddings=[query_embedding],
            n_results=top_k,
            where=where,
            include=["documents", "metadatas", "distances"],
        )

        hits = []
        if results and results["ids"] and results["ids"][0]:
            for i, chunk_id in enumerate(results["ids"][0]):
                hits.append(
                    {
                        "id": chunk_id,
                        "content": results["documents"][0][i] if results["documents"] else "",
                        "metadata": results["metadatas"][0][i] if results["metadatas"] else {},
                        "distance": results["distances"][0][i] if results["distances"] else 1.0,
                    }
                )
        return hits

    def delete_by_document(self, document_id: str, workspace_id: str | None = None) -> None:
        """Delete all chunks belonging to a specific document."""
        # We need to search across workspace collections
        collections = self.client.list_collections()
        for col_info in collections:
            try:
                col = self.client.get_collection(col_info.name)
                col.delete(where={"document_id": document_id})
            except Exception:
                pass

    def delete_collection(self, workspace_id: str) -> None:
        """Delete an entire workspace collection."""
        try:
            self.client.delete_collection(f"workspace_{workspace_id}")
        except Exception:
            pass


def get_vector_store() -> VectorStore:
    """Get or create the VectorStore singleton."""
    global _client
    if _client is None:
        persist_dir = settings.CHROMA_PERSIST_DIR
        os.makedirs(persist_dir, exist_ok=True)
        _client = chromadb.PersistentClient(
            path=persist_dir,
            settings=ChromaSettings(anonymized_telemetry=False),
        )
    return VectorStore(_client)
