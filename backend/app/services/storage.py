"""File storage abstraction – local filesystem and S3."""

from __future__ import annotations

import os
import shutil
from abc import ABC, abstractmethod

from app.config import settings


class StorageBackend(ABC):
    @abstractmethod
    def save(self, data: bytes, path: str) -> str:
        """Save bytes and return the stored path."""
        ...

    @abstractmethod
    def delete(self, path: str) -> None:
        ...

    @abstractmethod
    def exists(self, path: str) -> bool:
        ...

    @abstractmethod
    def read(self, path: str) -> bytes:
        ...


class LocalStorage(StorageBackend):
    def __init__(self, base_dir: str = ""):
        self.base_dir = base_dir or settings.UPLOAD_DIR

    def save(self, data: bytes, path: str) -> str:
        full_path = os.path.join(self.base_dir, path)
        os.makedirs(os.path.dirname(full_path), exist_ok=True)
        with open(full_path, "wb") as f:
            f.write(data)
        return full_path

    def delete(self, path: str) -> None:
        if os.path.exists(path):
            os.remove(path)

    def exists(self, path: str) -> bool:
        return os.path.exists(path)

    def read(self, path: str) -> bytes:
        with open(path, "rb") as f:
            return f.read()


class S3Storage(StorageBackend):
    def __init__(self):
        try:
            import boto3

            self.s3 = boto3.client(
                "s3",
                aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
                aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
                region_name=settings.AWS_REGION,
            )
            self.bucket = settings.S3_BUCKET_NAME
        except ImportError:
            raise RuntimeError("boto3 is required for S3 storage backend")

    def save(self, data: bytes, path: str) -> str:
        self.s3.put_object(Bucket=self.bucket, Key=path, Body=data)
        return f"s3://{self.bucket}/{path}"

    def delete(self, path: str) -> None:
        key = path.replace(f"s3://{self.bucket}/", "")
        self.s3.delete_object(Bucket=self.bucket, Key=key)

    def exists(self, path: str) -> bool:
        key = path.replace(f"s3://{self.bucket}/", "")
        try:
            self.s3.head_object(Bucket=self.bucket, Key=key)
            return True
        except Exception:
            return False

    def read(self, path: str) -> bytes:
        key = path.replace(f"s3://{self.bucket}/", "")
        response = self.s3.get_object(Bucket=self.bucket, Key=key)
        return response["Body"].read()


def get_storage() -> StorageBackend:
    if settings.STORAGE_BACKEND == "s3":
        return S3Storage()
    return LocalStorage()
