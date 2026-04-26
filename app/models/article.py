"""Article model."""

from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship

from app.core.datetime import utc_now
from app.db.database import Base


class Article(Base):
    """Article table with author ownership and category binding."""

    __tablename__ = "articles"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), index=True, nullable=False)
    summary = Column(String(500), nullable=True)
    content = Column(Text, nullable=False)
    view_count = Column(Integer, default=0, nullable=False)
    author_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    category_id = Column(
        Integer,
        ForeignKey("categories.id"),
        nullable=False,
        index=True,
    )
    created_at = Column(DateTime, default=utc_now, nullable=False)
    updated_at = Column(
        DateTime,
        default=utc_now,
        onupdate=utc_now,
        nullable=False,
    )

    author = relationship("User", back_populates="articles")
    category = relationship("Category", back_populates="articles")
