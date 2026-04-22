"""Article endpoints."""

from typing import Optional

from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, get_db
from app.core.response import build_page_response, build_response
from app.crud.article import (
    create_article,
    delete_article,
    get_article_by_id,
    get_articles,
    increment_article_view_count,
    update_article,
)
from app.crud.category import get_category_by_id
from app.exceptions.custom import AppException
from app.models.user import User
from app.schemas.article import (
    ArticleCreate,
    ArticleDetail,
    ArticleListItem,
    ArticleUpdate,
)
from app.schemas.common import APIResponse, PageData

router = APIRouter()


def _ensure_article_owner(article_author_id: int, current_user_id: int) -> None:
    """Ensure the current user owns the target article."""
    if article_author_id != current_user_id:
        raise AppException(
            message="无权限操作该文章，仅作者本人可修改或删除",
            status_code=403,
            code=403,
        )


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
    if not get_category_by_id(db, article_in.category_id):
        raise AppException(message="分类不存在", status_code=404, code=404)

    article = create_article(db, article_in, current_user.id)
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
    """Return a paginated article list with optional category filtering."""
    items, total = get_articles(
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
def read_article(article_id: int, db: Session = Depends(get_db)) -> dict:
    """Return a single article and increase its view count."""
    article = get_article_by_id(db, article_id)
    if not article:
        raise AppException(message="文章不存在", status_code=404, code=404)

    article = increment_article_view_count(db, article)
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
    article = get_article_by_id(db, article_id)
    if not article:
        raise AppException(message="文章不存在", status_code=404, code=404)

    _ensure_article_owner(article.author_id, current_user.id)

    if article_in.category_id is not None and not get_category_by_id(db, article_in.category_id):
        raise AppException(message="分类不存在", status_code=404, code=404)

    updated_article = update_article(db, article, article_in)
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
    article = get_article_by_id(db, article_id)
    if not article:
        raise AppException(message="文章不存在", status_code=404, code=404)

    _ensure_article_owner(article.author_id, current_user.id)
    delete_article(db, article)
    return build_response(msg="文章删除成功")
