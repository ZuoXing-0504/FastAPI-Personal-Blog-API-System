"""Common Pydantic schemas."""

from typing import Generic, Optional, TypeVar

from pydantic import BaseModel, ConfigDict, Field

DataT = TypeVar("DataT")
ItemT = TypeVar("ItemT")


class BaseSchema(BaseModel):
    """Base schema with ORM compatibility enabled."""

    model_config = ConfigDict(from_attributes=True)


class APIResponse(BaseModel, Generic[DataT]):
    """Unified response schema."""

    code: int = Field(default=200, description="业务状态码，通常与 HTTP 状态码一致。")
    msg: str = Field(default="操作成功", description="响应提示信息。")
    data: Optional[DataT] = Field(default=None, description="响应数据。")


class PageData(BaseModel, Generic[ItemT]):
    """Paginated payload schema."""

    items: list[ItemT] = Field(default_factory=list, description="当前页数据。")
    total: int = Field(..., description="总记录数。")
    page: int = Field(..., description="当前页码。")
    page_size: int = Field(..., description="当前页大小。")
    total_pages: int = Field(..., description="总页数。")
