"""Article endpoints."""

from typing import Optional

from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, get_db
from app.core.response import build_page_response, build_response
from app.models.user import User
from app.schemas.article import (
    ArticleCreate,
    ArticleDetail,
    ArticleListItem,
    ArticleUpdate,
)
from app.schemas.common import APIResponse, PageData
from app.services.article import (
    create_article_service,
    delete_article_service,
    list_articles_service,
    read_article_service,
    update_article_service,
)

router = APIRouter()


@router.post(
    "",
    status_code=status.HTTP_201_CREATED,
    response_model=APIResponse[ArticleDetail],
    summary="发布文章",
)
def create_article_endpoint(
    article_in: ArticleCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> dict:
    """Create a new article for the current user."""
    article = create_article_service(db, article_in, current_user.id)
    return build_response(
        data=ArticleDetail.model_validate(article),
        msg="文章发布成功",
        code=status.HTTP_201_CREATED,
    )


@router.get(
    "",
    response_model=APIResponse[PageData[ArticleListItem]],
    summary="分页查询文章列表",
)
def list_articles(
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=10, ge=1, le=100),
    category_id: Optional[int] = Query(default=None, gt=0),
    keyword: Optional[str] = Query(default=None, max_length=100),
    db: Session = Depends(get_db),
) -> dict:
    """Return a paginated article list with optional filters."""
    items, total = list_articles_service(
        db,
        page=page,
        page_size=page_size,
        category_id=category_id,
        keyword=keyword,
    )
    data = [ArticleListItem.model_validate(article) for article in items]
    return build_page_response(
        items=data,
        total=total,
        page=page,
        page_size=page_size,
        msg="查询文章列表成功",
    )


@router.get(
    "/{article_id}",
    response_model=APIResponse[ArticleDetail],
    summary="查看文章详情",
)
def read_article(
    article_id: int,
    track_view: bool = Query(default=True),
    db: Session = Depends(get_db),
) -> dict:
    """Return a single article and optionally increase its view count."""
    article = read_article_service(db, article_id, track_view=track_view)
    return build_response(
        data=ArticleDetail.model_validate(article),
        msg="查询文章详情成功",
    )


@router.put(
    "/{article_id}",
    response_model=APIResponse[ArticleDetail],
    summary="修改文章",
)
def update_article_endpoint(
    article_id: int,
    article_in: ArticleUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> dict:
    """Update an article. Only the author can modify it."""
    updated_article = update_article_service(
        db,
        article_id=article_id,
        article_in=article_in,
        current_user_id=current_user.id,
    )
    return build_response(
        data=ArticleDetail.model_validate(updated_article),
        msg="文章修改成功",
    )


@router.delete(
    "/{article_id}",
    response_model=APIResponse[None],
    summary="删除文章",
)
def delete_article_endpoint(
    article_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> dict:
    """Delete an article. Only the author can delete it."""
    delete_article_service(db, article_id=article_id, current_user_id=current_user.id)
    return build_response(msg="文章删除成功")
