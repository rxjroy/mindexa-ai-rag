"""Document endpoint tests."""

from __future__ import annotations

import io
import pytest
from httpx import AsyncClient

pytestmark = pytest.mark.asyncio


async def _create_workspace(client: AsyncClient, headers: dict) -> str:
    response = await client.post(
        "/api/v1/workspaces",
        json={"name": "Test Workspace", "description": "For testing"},
        headers=headers,
    )
    assert response.status_code == 201
    return response.json()["id"]


async def test_create_workspace(client: AsyncClient, auth_headers: dict):
    response = await client.post(
        "/api/v1/workspaces",
        json={"name": "My Workspace"},
        headers=auth_headers,
    )
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "My Workspace"
    assert data["document_count"] == 0


async def test_list_workspaces(client: AsyncClient, auth_headers: dict):
    await _create_workspace(client, auth_headers)
    response = await client.get("/api/v1/workspaces", headers=auth_headers)
    assert response.status_code == 200
    assert len(response.json()) >= 1


async def test_delete_workspace(client: AsyncClient, auth_headers: dict):
    ws_id = await _create_workspace(client, auth_headers)
    response = await client.delete(f"/api/v1/workspaces/{ws_id}", headers=auth_headers)
    assert response.status_code == 204


async def test_upload_txt_document(client: AsyncClient, auth_headers: dict):
    ws_id = await _create_workspace(client, auth_headers)

    file_content = b"This is a test document with some sample text for testing the upload pipeline."

    response = await client.post(
        f"/api/v1/workspaces/{ws_id}/documents",
        files={"file": ("test.txt", io.BytesIO(file_content), "text/plain")},
        headers=auth_headers,
    )
    assert response.status_code == 201
    data = response.json()
    assert data["filename"] == "test.txt"
    assert data["status"] in ["ready", "failed"]  # May fail without OpenAI key


async def test_list_documents(client: AsyncClient, auth_headers: dict):
    ws_id = await _create_workspace(client, auth_headers)

    file_content = b"Test document content."
    await client.post(
        f"/api/v1/workspaces/{ws_id}/documents",
        files={"file": ("test.txt", io.BytesIO(file_content), "text/plain")},
        headers=auth_headers,
    )

    response = await client.get(
        f"/api/v1/workspaces/{ws_id}/documents",
        headers=auth_headers,
    )
    assert response.status_code == 200
    data = response.json()
    assert data["total"] >= 1


async def test_delete_document(client: AsyncClient, auth_headers: dict):
    ws_id = await _create_workspace(client, auth_headers)

    file_content = b"Document to delete."
    upload = await client.post(
        f"/api/v1/workspaces/{ws_id}/documents",
        files={"file": ("delete_me.txt", io.BytesIO(file_content), "text/plain")},
        headers=auth_headers,
    )
    doc_id = upload.json()["id"]

    response = await client.delete(f"/api/v1/documents/{doc_id}", headers=auth_headers)
    assert response.status_code == 204


async def test_upload_unsupported_type(client: AsyncClient, auth_headers: dict):
    ws_id = await _create_workspace(client, auth_headers)

    response = await client.post(
        f"/api/v1/workspaces/{ws_id}/documents",
        files={"file": ("test.exe", io.BytesIO(b"binary"), "application/octet-stream")},
        headers=auth_headers,
    )
    assert response.status_code == 400
