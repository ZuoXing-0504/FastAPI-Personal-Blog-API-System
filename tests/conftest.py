"""Common pytest fixtures for API integration tests."""

from typing import Generator

import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.db.base import Base
from app.db.database import create_db_engine, create_session_factory
from app.main import create_app


@pytest.fixture()
def client() -> Generator[TestClient, None, None]:
    """Create an isolated test client backed by an in-memory SQLite database."""
    test_engine = create_db_engine("sqlite:///:memory:")
    testing_session_local = create_session_factory(test_engine)
    Base.metadata.create_all(bind=test_engine)

    app = create_app()

    def override_get_db() -> Generator[Session, None, None]:
        db = testing_session_local()
        try:
            yield db
        finally:
            db.close()

    app.dependency_overrides[get_db] = override_get_db

    with TestClient(app) as test_client:
        yield test_client

    app.dependency_overrides.clear()
    Base.metadata.drop_all(bind=test_engine)
    test_engine.dispose()
