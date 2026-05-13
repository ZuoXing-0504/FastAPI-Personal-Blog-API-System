"""Authentication service helpers."""

from __future__ import annotations

from datetime import timedelta
from typing import Tuple

from jwt import ExpiredSignatureError, InvalidTokenError
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.datetime import utc_now
from app.core.security import (
    create_access_token,
    create_refresh_token,
    decode_access_token,
    generate_token_id,
)
from app.crud.refresh_token import (
    create_refresh_token_record,
    get_refresh_token_by_token_id,
    revoke_refresh_token,
)
from app.crud.user import (
    authenticate_user,
    create_user,
    get_user_by_email,
    get_user_by_id,
    get_user_by_username,
)
from app.exceptions.custom import AppException
from app.models.refresh_token import RefreshToken
from app.models.user import User
from app.schemas.auth import LoginResponseData
from app.schemas.user import UserCreate, UserLogin, UserPublic


def register_new_user(db: Session, user_in: UserCreate) -> User:
    """Register a new user after checking username and email uniqueness."""
    if get_user_by_username(db, user_in.username):
        raise AppException(message="用户名已存在", status_code=400, code=400)
    if get_user_by_email(db, user_in.email):
        raise AppException(message="邮箱已被注册", status_code=400, code=400)
    return create_user(db, user_in)


def authenticate_and_issue_tokens(db: Session, user_in: UserLogin) -> LoginResponseData:
    """Verify credentials and return a fresh access/refresh token pair."""
    user = authenticate_user(db, user_in.username, user_in.password)
    if not user:
        raise AppException(message="用户名或密码错误", status_code=401, code=401)
    return issue_token_pair(db, user)


def resolve_active_user_from_access_token(db: Session, token: str) -> User:
    """Resolve the active user from an access token."""
    payload = _decode_token(token)
    if payload.get("type") != "access":
        raise AppException(message="请使用访问令牌访问该接口", status_code=401, code=401)
    user_id = _get_subject_as_int(payload)
    user = get_user_by_id(db, user_id)
    if not user:
        raise AppException(message="用户不存在，请重新登录", status_code=401, code=401)
    if not user.is_active:
        raise AppException(message="当前用户已被禁用", status_code=403, code=403)
    return user


def refresh_user_tokens(db: Session, refresh_token: str) -> LoginResponseData:
    """Rotate a refresh token and return a new access/refresh token pair."""
    user, token_record = resolve_refresh_token(db, refresh_token)
    revoke_refresh_token(db, token_record)
    return issue_token_pair(db, user)


def logout_user(db: Session, refresh_token: str) -> None:
    """Revoke a refresh token during logout."""
    _, token_record = resolve_refresh_token(db, refresh_token)
    revoke_refresh_token(db, token_record)


def issue_token_pair(db: Session, user: User) -> LoginResponseData:
    """Create and persist a new access/refresh token pair for the user."""
    access_expires = timedelta(minutes=settings.access_token_expire_minutes)
    refresh_expires = timedelta(days=settings.refresh_token_expire_days)
    refresh_token_id = generate_token_id()

    access_token = create_access_token(subject=user.id, expires_delta=access_expires)
    refresh_token = create_refresh_token(
        subject=user.id,
        token_id=refresh_token_id,
        expires_delta=refresh_expires,
    )
    create_refresh_token_record(
        db,
        user_id=user.id,
        token_id=refresh_token_id,
        expires_at=utc_now() + refresh_expires,
    )

    return LoginResponseData(
        access_token=access_token,
        refresh_token=refresh_token,
        token_type="bearer",
        expires_in=int(access_expires.total_seconds()),
        refresh_expires_in=int(refresh_expires.total_seconds()),
        user=UserPublic.model_validate(user),
    )


def resolve_refresh_token(db: Session, refresh_token: str) -> Tuple[User, RefreshToken]:
    """Validate a refresh token and return the associated user and DB record."""
    payload = _decode_token(refresh_token)
    if payload.get("type") != "refresh":
        raise AppException(message="请使用刷新令牌调用该接口", status_code=401, code=401)

    user_id = _get_subject_as_int(payload)
    token_id = payload.get("jti")
    if not token_id:
        raise AppException(message="刷新令牌无效", status_code=401, code=401)

    user = get_user_by_id(db, user_id)
    if not user:
        raise AppException(message="用户不存在，请重新登录", status_code=401, code=401)
    if not user.is_active:
        raise AppException(message="当前用户已被禁用", status_code=403, code=403)

    token_record = get_refresh_token_by_token_id(db, str(token_id))
    if not token_record:
        raise AppException(message="刷新令牌不存在或已失效", status_code=401, code=401)
    if token_record.user_id != user.id:
        raise AppException(message="刷新令牌与当前用户不匹配", status_code=401, code=401)
    if token_record.revoked_at is not None:
        raise AppException(message="刷新令牌已失效，请重新登录", status_code=401, code=401)
    if token_record.expires_at <= utc_now():
        raise AppException(message="刷新令牌已过期，请重新登录", status_code=401, code=401)

    return user, token_record


def _decode_token(token: str) -> dict:
    """Decode a JWT token and raise a business error when invalid."""
    try:
        return decode_access_token(token)
    except ExpiredSignatureError as exc:
        raise AppException(message="登录已过期，请重新登录", status_code=401, code=401) from exc
    except (InvalidTokenError, ValueError) as exc:
        raise AppException(message="Token 无效或已损坏", status_code=401, code=401) from exc


def _get_subject_as_int(payload: dict) -> int:
    """Extract the JWT subject claim as an integer user id."""
    subject = payload.get("sub")
    if subject is None:
        raise AppException(message="登录状态无效，请重新登录", status_code=401, code=401)
    try:
        return int(subject)
    except (TypeError, ValueError) as exc:
        raise AppException(message="登录状态无效，请重新登录", status_code=401, code=401) from exc
