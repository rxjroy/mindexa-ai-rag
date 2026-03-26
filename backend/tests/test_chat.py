"""Chat endpoint tests – conversation CRUD, messaging, and delete operations."""

from __future__ import annotations

import pytest
from httpx import AsyncClient

pytestmark = pytest.mark.asyncio


async def _create_workspace(client: AsyncClient, headers: dict) -> str:
    response = await client.post(
        "/api/v1/workspaces",
        json={"name": "Chat Test Workspace"},
        headers=headers,
    )
    assert response.status_code == 201
    return response.json()["id"]


async def _create_conversation(client: AsyncClient, headers: dict, ws_id: str) -> str:
    response = await client.post(
        f"/api/v1/workspaces/{ws_id}/conversations",
        json={"title": "Test Chat"},
        headers=headers,
    )
    assert response.status_code == 201
    return response.json()["id"]


async def test_create_conversation(client: AsyncClient, auth_headers: dict):
    ws_id = await _create_workspace(client, auth_headers)
    response = await client.post(
        f"/api/v1/workspaces/{ws_id}/conversations",
        json={"title": "My First Chat"},
        headers=auth_headers,
    )
    assert response.status_code == 201
    data = response.json()
    assert data["title"] == "My First Chat"
    assert data["message_count"] == 0


async def test_list_conversations(client: AsyncClient, auth_headers: dict):
    ws_id = await _create_workspace(client, auth_headers)
    await _create_conversation(client, auth_headers, ws_id)
    await _create_conversation(client, auth_headers, ws_id)

    response = await client.get(
        f"/api/v1/workspaces/{ws_id}/conversations",
        headers=auth_headers,
    )
    assert response.status_code == 200
    data = response.json()
    assert data["total"] == 2


async def test_get_conversation_history(client: AsyncClient, auth_headers: dict):
    ws_id = await _create_workspace(client, auth_headers)
    conv_id = await _create_conversation(client, auth_headers, ws_id)

    response = await client.get(
        f"/api/v1/conversations/{conv_id}",
        headers=auth_headers,
    )
    assert response.status_code == 200
    data = response.json()
    assert data["conversation"]["id"] == conv_id
    assert data["messages"] == []


async def test_delete_conversation(client: AsyncClient, auth_headers: dict):
    ws_id = await _create_workspace(client, auth_headers)
    conv_id = await _create_conversation(client, auth_headers, ws_id)

    response = await client.delete(
        f"/api/v1/conversations/{conv_id}",
        headers=auth_headers,
    )
    assert response.status_code == 204

    # Verify it's gone
    response = await client.get(
        f"/api/v1/conversations/{conv_id}",
        headers=auth_headers,
    )
    assert response.status_code == 404


async def test_delete_all_conversations(client: AsyncClient, auth_headers: dict):
    ws_id = await _create_workspace(client, auth_headers)
    await _create_conversation(client, auth_headers, ws_id)
    await _create_conversation(client, auth_headers, ws_id)
    await _create_conversation(client, auth_headers, ws_id)

    # Delete all
    response = await client.delete(
        f"/api/v1/workspaces/{ws_id}/conversations",
        headers=auth_headers,
    )
    assert response.status_code == 204

    # Verify all gone
    response = await client.get(
        f"/api/v1/workspaces/{ws_id}/conversations",
        headers=auth_headers,
    )
    assert response.status_code == 200
    assert response.json()["total"] == 0


async def test_conversation_not_found(client: AsyncClient, auth_headers: dict):
    response = await client.get(
        "/api/v1/conversations/nonexistent-id",
        headers=auth_headers,
    )
    assert response.status_code == 404
