"""Article and category API integration tests."""

from fastapi.testclient import TestClient


def register_user(client: TestClient, username: str, email: str, password: str) -> None:
    """Register a new user for testing."""
    response = client.post(
        "/api/v1/auth/register",
        json={
            "username": username,
            "email": email,
            "password": password,
        },
    )
    assert response.status_code == 201


def login_for_token(client: TestClient, username: str, password: str) -> str:
    """Log in and return the JWT token."""
    response = client.post(
        "/api/v1/auth/login",
        json={
            "username": username,
            "password": password,
        },
    )
    assert response.status_code == 200
    return response.json()["data"]["access_token"]


def auth_headers(token: str) -> dict:
    """Build an authorization header for protected endpoints."""
    return {"Authorization": f"Bearer {token}"}


def test_article_crud_flow_and_permissions(client: TestClient) -> None:
    """The full article flow should enforce pagination and author-only permissions."""
    register_user(client, "author_user", "author@example.com", "abc12345")
    author_token = login_for_token(client, "author_user", "abc12345")

    category_response = client.post(
        "/api/v1/categories",
        json={"name": "tech", "description": "tech category"},
        headers=auth_headers(author_token),
    )
    assert category_response.status_code == 201
    category_id = category_response.json()["data"]["id"]

    article_response = client.post(
        "/api/v1/articles",
        json={
            "title": "FastAPI project demo article",
            "summary": "Used to verify article APIs",
            "content": "This is a sample article body used in automated tests.",
            "category_id": category_id,
        },
        headers=auth_headers(author_token),
    )
    assert article_response.status_code == 201
    article_body = article_response.json()
    article_id = article_body["data"]["id"]

    list_response = client.get(
        f"/api/v1/articles?page=1&page_size=10&category_id={category_id}",
    )
    assert list_response.status_code == 200
    list_body = list_response.json()
    assert list_body["data"]["total"] == 1
    assert list(list_body["data"]["items"][0].keys()) == [
        "id",
        "title",
        "summary",
        "author",
        "category",
        "created_at",
    ]

    detail_response = client.get(f"/api/v1/articles/{article_id}")
    assert detail_response.status_code == 200
    assert detail_response.json()["data"]["view_count"] == 1

    second_detail_response = client.get(f"/api/v1/articles/{article_id}")
    assert second_detail_response.status_code == 200
    assert second_detail_response.json()["data"]["view_count"] == 2

    update_response = client.put(
        f"/api/v1/articles/{article_id}",
        json={"title": "FastAPI project demo article updated"},
        headers=auth_headers(author_token),
    )
    assert update_response.status_code == 200
    assert update_response.json()["data"]["title"] == "FastAPI project demo article updated"

    register_user(client, "other_user", "other@example.com", "abc12345")
    other_token = login_for_token(client, "other_user", "abc12345")
    forbidden_response = client.put(
        f"/api/v1/articles/{article_id}",
        json={"title": "forbidden update"},
        headers=auth_headers(other_token),
    )
    assert forbidden_response.status_code == 403
    assert forbidden_response.json()["code"] == 403

    delete_response = client.delete(
        f"/api/v1/articles/{article_id}",
        headers=auth_headers(author_token),
    )
    assert delete_response.status_code == 200
    assert delete_response.json()["code"] == 200

    missing_response = client.get(f"/api/v1/articles/{article_id}")
    assert missing_response.status_code == 404
    assert missing_response.json()["code"] == 404
