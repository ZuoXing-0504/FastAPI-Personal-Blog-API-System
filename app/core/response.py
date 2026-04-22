"""Helpers for the unified API response format."""

import math
from typing import Any

from fastapi.encoders import jsonable_encoder


def build_response(
    data: Any = None,
    msg: str = "操作成功",
    code: int = 200,
) -> dict[str, Any]:
    """Build a standard success response body."""
    return {
        "code": code,
        "msg": msg,
        "data": jsonable_encoder(data),
    }


def build_page_response(
    *,
    items: list[Any],
    total: int,
    page: int,
    page_size: int,
    msg: str = "查询成功",
    code: int = 200,
) -> dict[str, Any]:
    """Build a standard paginated response body."""
    total_pages = math.ceil(total / page_size) if total else 0
    return build_response(
        data={
            "items": items,
            "total": total,
            "page": page,
            "page_size": page_size,
            "total_pages": total_pages,
        },
        msg=msg,
        code=code,
    )
