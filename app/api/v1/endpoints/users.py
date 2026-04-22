"""User endpoints."""

from fastapi import APIRouter, Depends

from app.api.deps import get_current_user
from app.core.response import build_response
from app.models.user import User
from app.schemas.common import APIResponse
from app.schemas.user import UserPublic

router = APIRouter()


@router.get(
    "/me",
    response_model=APIResponse[UserPublic],
    summary="获取当前登录用户信息",
)
def read_current_user(current_user: User = Depends(get_current_user)) -> dict:
    """Return the authenticated user's profile information."""
    return build_response(
        data=UserPublic.model_validate(current_user),
        msg="获取当前用户信息成功",
    )
