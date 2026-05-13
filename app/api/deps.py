"""Reusable FastAPI dependencies."""

from typing import Generator, Optional

from fastapi import Depends
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from app.core.config import settings
from app.db.database import SessionLocal
from app.exceptions.custom import AppException
from app.models.user import User
from app.services.auth import resolve_active_user_from_access_token

oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl=f"{settings.api_v1_prefix}/auth/login",
    auto_error=False,
)


def get_db() -> Generator[Session, None, None]:
    """Provide a database session per request."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def get_current_user(
    db: Session = Depends(get_db),
    token: Optional[str] = Depends(oauth2_scheme),
) -> User:
    """Resolve the current authenticated user from an access token."""
    if not token:
        raise AppException(message="未登录，请先登录", status_code=401, code=401)
    return resolve_active_user_from_access_token(db, token)
