"""Category schemas."""

from datetime import datetime
from typing import Optional

from pydantic import Field, field_validator

from app.schemas.common import BaseSchema


class CategoryCreate(BaseSchema):
    """Schema used when creating a category."""

    name: str = Field(..., max_length=100)
    description: Optional[str] = Field(default=None, max_length=500)

    @field_validator("name")
    @classmethod
    def validate_name(cls, value: str) -> str:
        """Reject blank category names."""
        name = value.strip()
        if not name:
            raise ValueError("分类名称不能为空")
        return name

    @field_validator("description")
    @classmethod
    def normalize_description(cls, value: Optional[str]) -> Optional[str]:
        """Normalize category description text."""
        return value.strip() if value is not None else value


class CategoryUpdate(BaseSchema):
    """Schema used when updating a category."""

    name: Optional[str] = Field(default=None, max_length=100)
    description: Optional[str] = Field(default=None, max_length=500)

    @field_validator("name")
    @classmethod
    def validate_optional_name(cls, value: Optional[str]) -> Optional[str]:
        """Reject blank category names during updates."""
        if value is None:
            return value
        name = value.strip()
        if not name:
            raise ValueError("分类名称不能为空")
        return name

    @field_validator("description")
    @classmethod
    def normalize_optional_description(cls, value: Optional[str]) -> Optional[str]:
        """Normalize optional category description text."""
        return value.strip() if value is not None else value


class CategorySimple(BaseSchema):
    """Compact category information embedded in article responses."""

    id: int
    name: str


class CategoryRead(BaseSchema):
    """Category details returned to clients."""

    id: int
    name: str
    description: Optional[str] = None
    created_at: datetime
    updated_at: datetime
