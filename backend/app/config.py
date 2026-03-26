"""Application configuration loaded from environment variables."""

from __future__ import annotations

import json
from typing import List

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Central configuration – values come from .env."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    # ── App ──
    APP_NAME: str = "Mindexa AI"
    DEBUG: bool = False

    # ── Database ──
    DATABASE_URL: str = "postgresql+asyncpg://mindexa:mindexa_secret@localhost:5432/mindexa_db"

    # ── Security / JWT ──
    SECRET_KEY: str = "change-me-to-a-random-64-char-string"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    # ── CORS ──
    CORS_ORIGINS: str = '["http://localhost:3000","http://127.0.0.1:3000"]'

    @property
    def cors_origins_list(self) -> List[str]:
        try:
            return json.loads(self.CORS_ORIGINS)
        except (json.JSONDecodeError, TypeError):
            return ["http://localhost:3000"]

    # ── OpenAI / LLM ──
    OPENAI_API_KEY: str = ""
    LLM_MODEL: str = "gpt-4o-mini"
    EMBEDDING_MODEL: str = "text-embedding-3-small"
    EMBEDDING_PROVIDER: str = "openai"  # "openai" | "huggingface"

    # ── ChromaDB ──
    CHROMA_PERSIST_DIR: str = "./chroma_data"

    # ── File Storage ──
    STORAGE_BACKEND: str = "local"  # "local" | "s3"
    UPLOAD_DIR: str = "./uploads"
    S3_BUCKET_NAME: str = ""
    AWS_ACCESS_KEY_ID: str = ""
    AWS_SECRET_ACCESS_KEY: str = ""
    AWS_REGION: str = "us-east-1"

    # ── Redis / Celery ──
    REDIS_URL: str = "redis://localhost:6379/0"
    USE_CELERY: bool = False


settings = Settings()
