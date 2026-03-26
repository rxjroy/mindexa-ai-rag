"""Auth endpoint tests."""

from __future__ import annotations

import pytest
from httpx import AsyncClient

pytestmark = pytest.mark.asyncio


async def test_signup_success(client: AsyncClient):
    response = await client.post(
        "/api/v1/auth/signup",
        json={
            "email": "newuser@example.com",
            "full_name": "New User",
            "password": "securepass123",
        },
    )
    assert response.status_code == 201
    data = response.json()
    assert "access_token" in data
    assert "refresh_token" in data
    assert data["token_type"] == "bearer"


async def test_signup_duplicate_email(client: AsyncClient):
    payload = {
        "email": "dup@example.com",
        "full_name": "Dup User",
        "password": "securepass123",
    }
    await client.post("/api/v1/auth/signup", json=payload)
    response = await client.post("/api/v1/auth/signup", json=payload)
    assert response.status_code == 409


async def test_signup_weak_password(client: AsyncClient):
    response = await client.post(
        "/api/v1/auth/signup",
        json={
            "email": "weak@example.com",
            "full_name": "Weak",
            "password": "short",
        },
    )
    assert response.status_code == 422  # Pydantic validation


async def test_login_success(client: AsyncClient):
    await client.post(
        "/api/v1/auth/signup",
        json={
            "email": "login@example.com",
            "full_name": "Login User",
            "password": "mypassword123",
        },
    )
    response = await client.post(
        "/api/v1/auth/login",
        json={"email": "login@example.com", "password": "mypassword123"},
    )
    assert response.status_code == 200
    assert "access_token" in response.json()


async def test_login_wrong_password(client: AsyncClient):
    await client.post(
        "/api/v1/auth/signup",
        json={
            "email": "wrong@example.com",
            "full_name": "Wrong User",
            "password": "correctpass123",
        },
    )
    response = await client.post(
        "/api/v1/auth/login",
        json={"email": "wrong@example.com", "password": "wrongpass"},
    )
    assert response.status_code == 401


async def test_get_me(client: AsyncClient, auth_headers: dict):
    response = await client.get("/api/v1/auth/me", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == "test@example.com"
    assert data["role"] == "user"


async def test_refresh_token(client: AsyncClient):
    signup = await client.post(
        "/api/v1/auth/signup",
        json={
            "email": "refresh@example.com",
            "full_name": "Refresh User",
            "password": "refreshpass123",
        },
    )
    refresh = signup.json()["refresh_token"]

    response = await client.post(
        "/api/v1/auth/refresh",
        json={"refresh_token": refresh},
    )
    assert response.status_code == 200
    assert "access_token" in response.json()


async def test_protected_route_without_token(client: AsyncClient):
    response = await client.get("/api/v1/auth/me")
    assert response.status_code == 403  # HTTPBearer returns 403 when missing
