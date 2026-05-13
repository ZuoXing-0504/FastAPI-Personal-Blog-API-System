"""Authentication endpoints."""

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.core.response import build_response
from app.schemas.auth import LoginResponseData, LogoutRequest, RefreshTokenRequest
from app.schemas.common import APIResponse
from app.schemas.user import UserCreate, UserLogin, UserPublic
from app.services.auth import (
    authenticate_and_issue_tokens,
    logout_user,
    refresh_user_tokens,
    register_new_user,
)

router = APIRouter()


@router.post(
    "/register",
    status_code=status.HTTP_201_CREATED,
    response_model=APIResponse[UserPublic],
    summary="用户注册",
)
def register_user(user_in: UserCreate, db: Session = Depends(get_db)) -> dict:
    """Register a new user."""
    user = register_new_user(db, user_in)
    return build_response(
        data=UserPublic.model_validate(user),
        msg="注册成功",
        code=status.HTTP_201_CREATED,
    )


@router.post(
    "/login",
    response_model=APIResponse[LoginResponseData],
    summary="用户登录",
)
def login(user_in: UserLogin, db: Session = Depends(get_db)) -> dict:
    """Authenticate a user and return JWT tokens."""
    response_data = authenticate_and_issue_tokens(db, user_in)
    return build_response(data=response_data, msg="登录成功", code=status.HTTP_200_OK)


@router.post(
    "/refresh",
    response_model=APIResponse[LoginResponseData],
    summary="刷新访问令牌",
)
def refresh_token(payload: RefreshTokenRequest, db: Session = Depends(get_db)) -> dict:
    """Rotate a refresh token and return a new token pair."""
    response_data = refresh_user_tokens(db, payload.refresh_token)
    return build_response(data=response_data, msg="刷新令牌成功", code=status.HTTP_200_OK)


@router.post(
    "/logout",
    response_model=APIResponse[None],
    summary="退出登录",
)
def logout(payload: LogoutRequest, db: Session = Depends(get_db)) -> dict:
    """Revoke a refresh token during logout."""
    logout_user(db, payload.refresh_token)
    return build_response(msg="退出登录成功", code=status.HTTP_200_OK)
