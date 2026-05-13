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
    assert response.headers["X-Request-ID"]


def test_login_returns_token_pair(client: TestClient) -> None:
    """A successful login should return access and refresh tokens."""
    register_user(client)
    response = login_user(client)

    assert response.status_code == 200
    body = response.json()
    assert body["code"] == 200
    assert body["data"]["token_type"] == "bearer"
    assert body["data"]["access_token"]
    assert body["data"]["refresh_token"]
    assert body["data"]["refresh_expires_in"] > body["data"]["expires_in"]
    assert response.headers["X-Request-ID"]


def test_refresh_rotates_refresh_token(client: TestClient) -> None:
    """Refreshing should rotate the refresh token and invalidate the old one."""
    register_user(client)
    login_response = login_user(client)
    old_refresh_token = login_response.json()["data"]["refresh_token"]

    refresh_response = client.post(
        "/api/v1/auth/refresh",
        json={"refresh_token": old_refresh_token},
    )

    assert refresh_response.status_code == 200
    refreshed_body = refresh_response.json()
    new_refresh_token = refreshed_body["data"]["refresh_token"]
    assert refreshed_body["data"]["access_token"]
    assert new_refresh_token
    assert new_refresh_token != old_refresh_token

    old_refresh_retry = client.post(
        "/api/v1/auth/refresh",
        json={"refresh_token": old_refresh_token},
    )
    assert old_refresh_retry.status_code == 401
    assert old_refresh_retry.json()["code"] == 401


def test_logout_revokes_refresh_token(client: TestClient) -> None:
    """Logging out should revoke the refresh token."""
    register_user(client)
    login_response = login_user(client)
    refresh_token = login_response.json()["data"]["refresh_token"]

    logout_response = client.post(
        "/api/v1/auth/logout",
        json={"refresh_token": refresh_token},
    )
    assert logout_response.status_code == 200
    assert logout_response.json()["code"] == 200

    refresh_response = client.post(
        "/api/v1/auth/refresh",
        json={"refresh_token": refresh_token},
    )
    assert refresh_response.status_code == 401
    assert refresh_response.json()["code"] == 401


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


def test_protected_endpoint_requires_access_token(client: TestClient) -> None:
    """Protected endpoints should reject anonymous requests."""
    response = client.post(
        "/api/v1/categories",
        json={"name": "tech", "description": "tech articles"},
    )

    assert response.status_code == 401
    body = response.json()
    assert body["code"] == 401


def test_protected_endpoint_rejects_refresh_token(client: TestClient) -> None:
    """Protected endpoints should reject refresh tokens."""
    register_user(client)
    login_response = login_user(client)
    refresh_token = login_response.json()["data"]["refresh_token"]

    response = client.get(
        "/api/v1/users/me",
        headers={"Authorization": f"Bearer {refresh_token}"},
    )

    assert response.status_code == 401
    assert response.json()["code"] == 401
