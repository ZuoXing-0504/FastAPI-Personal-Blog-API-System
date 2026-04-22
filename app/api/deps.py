"""Reusable FastAPI dependencies."""

from typing import Optional

from fastapi import Depends
from fastapi.security import OAuth2PasswordBearer
from jwt import ExpiredSignatureError, InvalidTokenError
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.security import decode_access_token
from app.crud.user import get_user_by_id
from app.db.database import SessionLocal
from app.exceptions.custom import AppException
from app.models.user import User

oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl=f"{settings.api_v1_prefix}/auth/login",
    auto_error=False,
)


def get_db() -> Session:
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
    """Resolve the current authenticated user from the JWT token."""
    if not token:
        raise AppException(message="未登录，请先登录", status_code=401, code=401)

    try:
        payload = decode_access_token(token)
        subject = payload.get("sub")
        if subject is None:
            raise AppException(
                message="登录状态无效，请重新登录",
                status_code=401,
                code=401,
            )
        user_id = int(subject)
    except ExpiredSignatureError as exc:
        raise AppException(
            message="登录已过期，请重新登录",
            status_code=401,
            code=401,
        ) from exc
    except (InvalidTokenError, ValueError) as exc:
        raise AppException(
            message="Token 无效或已损坏",
            status_code=401,
            code=401,
        ) from exc

    user = get_user_by_id(db, user_id)
    if not user:
        raise AppException(
            message="用户不存在，请重新登录",
            status_code=401,
            code=401,
        )
    if not user.is_active:
        raise AppException(
            message="当前用户已被禁用",
            status_code=403,
            code=403,
        )
    return user
