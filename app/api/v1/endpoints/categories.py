"""Category endpoints."""

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, get_db
from app.core.response import build_response
from app.crud.category import (
    create_category,
    get_categories,
    get_category_by_name,
)
from app.exceptions.custom import AppException
from app.models.user import User
from app.schemas.category import CategoryCreate, CategoryRead
from app.schemas.common import APIResponse

router = APIRouter()


@router.post(
    "",
    status_code=status.HTTP_201_CREATED,
    response_model=APIResponse[CategoryRead],
    summary="创建分类",
)
def create_category_endpoint(
    category_in: CategoryCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> dict:
    """Create a category. Authentication is required."""
    if get_category_by_name(db, category_in.name):
        raise AppException(message="分类名称已存在", status_code=400, code=400)

    category = create_category(db, category_in)
    return build_response(
        data=CategoryRead.model_validate(category),
        msg="分类创建成功",
        code=status.HTTP_201_CREATED,
    )


@router.get(
    "",
    response_model=APIResponse[list[CategoryRead]],
    summary="查询分类列表",
)
def list_categories(db: Session = Depends(get_db)) -> dict:
    """Return all categories."""
    categories = get_categories(db)
    data = [CategoryRead.model_validate(category) for category in categories]
    return build_response(data=data, msg="查询分类列表成功")
