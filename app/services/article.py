"""Article service helpers."""

from typing import Optional

from sqlalchemy.orm import Session

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
from app.models.article import Article
from app.schemas.article import ArticleCreate, ArticleUpdate


def create_article_service(db: Session, article_in: ArticleCreate, current_user_id: int) -> Article:
    """Create a new article for the current user."""
    if not get_category_by_id(db, article_in.category_id):
        raise AppException(message="分类不存在", status_code=404, code=404)
    return create_article(db, article_in, current_user_id)


def list_articles_service(
    db: Session,
    *,
    page: int,
    page_size: int,
    category_id: Optional[int] = None,
    keyword: Optional[str] = None,
) -> tuple[list[Article], int]:
    """Return a paginated article list."""
    return get_articles(
        db,
        page=page,
        page_size=page_size,
        category_id=category_id,
        keyword=keyword,
    )


def read_article_service(
    db: Session,
    article_id: int,
    *,
    track_view: bool = True,
) -> Article:
    """Return an article detail record and optionally increase its view count."""
    article = get_article_by_id(db, article_id)
    if not article:
        raise AppException(message="文章不存在", status_code=404, code=404)
    if track_view:
        return increment_article_view_count(db, article)
    return article


def update_article_service(
    db: Session,
    *,
    article_id: int,
    article_in: ArticleUpdate,
    current_user_id: int,
) -> Article:
    """Update an article after validating ownership and category existence."""
    article = get_article_by_id(db, article_id)
    if not article:
        raise AppException(message="文章不存在", status_code=404, code=404)
    if article.author_id != current_user_id:
        raise AppException(message="无权限操作该文章，仅作者本人可修改或删除", status_code=403, code=403)
    if article_in.category_id is not None and not get_category_by_id(db, article_in.category_id):
        raise AppException(message="分类不存在", status_code=404, code=404)
    return update_article(db, article, article_in)


def delete_article_service(db: Session, *, article_id: int, current_user_id: int) -> None:
    """Delete an article after validating ownership."""
    article = get_article_by_id(db, article_id)
    if not article:
        raise AppException(message="文章不存在", status_code=404, code=404)
    if article.author_id != current_user_id:
        raise AppException(message="无权限操作该文章，仅作者本人可修改或删除", status_code=403, code=403)
    delete_article(db, article)
