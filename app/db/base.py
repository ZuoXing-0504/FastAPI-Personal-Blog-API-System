"""Import all models so SQLAlchemy metadata can discover them."""

from app.db.database import Base
from app.models.article import Article
from app.models.category import Category
from app.models.user import User

__all__ = ["Base", "User", "Category", "Article"]
