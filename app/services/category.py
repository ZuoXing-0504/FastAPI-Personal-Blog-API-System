"""Category service helpers."""

from sqlalchemy.orm import Session

from app.crud.category import create_category, get_categories, get_category_by_name
from app.exceptions.custom import AppException
from app.models.category import Category
from app.schemas.category import CategoryCreate


def create_category_service(db: Session, category_in: CategoryCreate) -> Category:
    """Create a category after validating uniqueness."""
    if get_category_by_name(db, category_in.name):
        raise AppException(message="分类名称已存在", status_code=400, code=400)
    return create_category(db, category_in)


def list_categories_service(db: Session) -> list[Category]:
    """Return all categories."""
    return get_categories(db)
