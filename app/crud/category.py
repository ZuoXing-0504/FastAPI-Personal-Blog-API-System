"""Category CRUD helpers."""

from typing import Optional

from sqlalchemy.orm import Session

from app.models.category import Category
from app.schemas.category import CategoryCreate, CategoryUpdate


def get_category_by_id(db: Session, category_id: int) -> Optional[Category]:
    """Fetch a category by primary key."""
    return db.query(Category).filter(Category.id == category_id).first()


def get_category_by_name(db: Session, name: str) -> Optional[Category]:
    """Fetch a category by name."""
    return db.query(Category).filter(Category.name == name).first()


def get_categories(db: Session) -> list[Category]:
    """Return all categories ordered by creation time."""
    return db.query(Category).order_by(Category.created_at.desc()).all()


def create_category(db: Session, category_in: CategoryCreate) -> Category:
    """Create a new category."""
    category = Category(
        name=category_in.name,
        description=category_in.description,
    )
    db.add(category)
    db.commit()
    db.refresh(category)
    return category


def update_category(
    db: Session,
    category: Category,
    category_in: CategoryUpdate,
) -> Category:
    """Update an existing category."""
    update_data = category_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(category, field, value)
    db.commit()
    db.refresh(category)
    return category
