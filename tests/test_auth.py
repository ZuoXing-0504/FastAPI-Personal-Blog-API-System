"""Authentication and authorization API tests."""

from fastapi.testclient import TestClient


def register_user(
    client: TestClient,
    *,
    username: str = "demo_user",
    email: str = "demo_user@example.com",
    password: str = "abc12345",
):
    """Register a user and return the response."""
    return client.post(
        "/api/v1/auth/register",
        json={
            "username": username,
            "email": email,
            "password": password,
        },
    )


def login_user(
    client: TestClient,
    *,
    username: str = "demo_user",
    password: str = "abc12345",
):
    """Log in a user and return the response."""
    return client.post(
        "/api/v1/auth/login",
        json={
            "username": username,
            "password": password,
        },
    )


def test_register_returns_user_without_password(client: TestClient) -> None:
    """A successful registration should return public user information only."""
    response = register_user(client)

    assert response.status_code == 201
    body = response.json()
    assert body["code"] == 201
    assert body["data"]["username"] == "demo_user"
    assert body["data"]["email"] == "demo_user@example.com"
    assert "password" not in body["data"]
    assert "password_hash" not in body["data"]


def test_login_returns_jwt_token(client: TestClient) -> None:
    """A successful login should return a bearer token."""
    register_user(client)
    response = login_user(client)

    assert response.status_code == 200
    body = response.json()
    assert body["code"] == 200
    assert body["data"]["token_type"] == "bearer"
    assert body["data"]["access_token"]


def test_register_rejects_duplicate_username(client: TestClient) -> None:
    """The API should reject duplicate usernames."""
    register_user(client)
    response = register_user(client, email="another@example.com")

    assert response.status_code == 400
    body = response.json()
    assert body["code"] == 400


def test_login_rejects_invalid_credentials(client: TestClient) -> None:
    """Invalid credentials should return a clear error message."""
    register_user(client)
    response = login_user(client, password="wrong123")

    assert response.status_code == 401
    body = response.json()
    assert body["code"] == 401


def test_protected_endpoint_requires_token(client: TestClient) -> None:
    """Protected endpoints should reject anonymous requests."""
    response = client.post(
        "/api/v1/categories",
        json={"name": "tech", "description": "tech articles"},
    )

    assert response.status_code == 401
    body = response.json()
    assert body["code"] == 401
