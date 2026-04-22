"""Article schemas."""

from datetime import datetime
from typing import Optional

from pydantic import Field, field_validator, model_validator

from app.schemas.category import CategorySimple
from app.schemas.common import BaseSchema
from app.schemas.user import UserSummary


class ArticleCreate(BaseSchema):
    """Schema used when creating an article."""

    title: str = Field(..., max_length=200)
    summary: Optional[str] = Field(default=None, max_length=500)
    content: str = Field(...)
    category_id: int = Field(..., gt=0)

    @field_validator("title", "content")
    @classmethod
    def validate_required_text(cls, value: str) -> str:
        """Reject blank title and content after trimming."""
        text = value.strip()
        if not text:
            raise ValueError("标题和内容不能为空")
        return text

    @field_validator("summary")
    @classmethod
    def normalize_summary(cls, value: Optional[str]) -> Optional[str]:
        """Normalize article summary."""
        return value.strip() if value is not None else value


class ArticleUpdate(BaseSchema):
    """Schema used when updating an article."""

    title: Optional[str] = Field(default=None, max_length=200)
    summary: Optional[str] = Field(default=None, max_length=500)
    content: Optional[str] = Field(default=None)
    category_id: Optional[int] = Field(default=None, gt=0)

    @field_validator("title", "content")
    @classmethod
    def validate_optional_text(cls, value: Optional[str]) -> Optional[str]:
        """Reject blank title or content during updates."""
        if value is None:
            return value
        text = value.strip()
        if not text:
            raise ValueError("标题和内容不能为空")
        return text

    @field_validator("summary")
    @classmethod
    def normalize_optional_summary(cls, value: Optional[str]) -> Optional[str]:
        """Normalize optional article summary."""
        return value.strip() if value is not None else value

    @model_validator(mode="after")
    def validate_at_least_one_field(self) -> "ArticleUpdate":
        """Reject empty update payloads."""
        if not self.model_dump(exclude_unset=True):
            raise ValueError("至少需要传入一个要修改的字段")
        return self


class ArticleListItem(BaseSchema):
    """Article summary information used by the list endpoint."""

    id: int
    title: str
    summary: Optional[str] = None
    author: UserSummary
    category: CategorySimple
    created_at: datetime


class ArticleDetail(ArticleListItem):
    """Article detail returned to clients."""

    content: str
    view_count: int
    updated_at: datetime
