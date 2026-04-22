"""Authentication endpoints."""

from datetime import timedelta

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.core.config import settings
from app.core.response import build_response
from app.core.security import create_access_token
from app.crud.user import (
    authenticate_user,
    create_user,
    get_user_by_email,
    get_user_by_username,
)
from app.exceptions.custom import AppException
from app.schemas.auth import LoginResponseData
from app.schemas.common import APIResponse
from app.schemas.user import UserCreate, UserLogin, UserPublic

router = APIRouter()


@router.post(
    "/register",
    status_code=status.HTTP_201_CREATED,
    response_model=APIResponse[UserPublic],
    summary="用户注册",
)
def register_user(user_in: UserCreate, db: Session = Depends(get_db)) -> dict:
    """Register a new user after checking username and email uniqueness."""
    if get_user_by_username(db, user_in.username):
        raise AppException(message="用户名已存在", status_code=400, code=400)
    if get_user_by_email(db, user_in.email):
        raise AppException(message="邮箱已被注册", status_code=400, code=400)

    user = create_user(db, user_in)
    user_data = UserPublic.model_validate(user)
    return build_response(
        data=user_data,
        msg="注册成功",
        code=status.HTTP_201_CREATED,
    )


@router.post(
    "/login",
    response_model=APIResponse[LoginResponseData],
    summary="用户登录",
)
def login(user_in: UserLogin, db: Session = Depends(get_db)) -> dict:
    """Authenticate a user and return a JWT access token."""
    user = authenticate_user(db, user_in.username, user_in.password)
    if not user:
        raise AppException(
            message="用户名或密码错误",
            status_code=401,
            code=401,
        )

    expires_delta = timedelta(minutes=settings.access_token_expire_minutes)
    access_token = create_access_token(subject=user.id, expires_delta=expires_delta)
    response_data = LoginResponseData(
        access_token=access_token,
        token_type="bearer",
        expires_in=settings.access_token_expire_minutes * 60,
        user=UserPublic.model_validate(user),
    )
    return build_response(data=response_data, msg="登录成功", code=status.HTTP_200_OK)
