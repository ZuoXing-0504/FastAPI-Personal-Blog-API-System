"""Article CRUD helpers."""

from typing import Optional

from sqlalchemy import or_
from sqlalchemy.orm import Session, joinedload

from app.models.article import Article
from app.schemas.article import ArticleCreate, ArticleUpdate


def get_article_by_id(db: Session, article_id: int) -> Optional[Article]:
    """Fetch a single article with author and category data."""
    return (
        db.query(Article)
        .options(joinedload(Article.author), joinedload(Article.category))
        .filter(Article.id == article_id)
        .first()
    )


def get_articles(
    db: Session,
    *,
    page: int,
    page_size: int,
    category_id: Optional[int] = None,
    keyword: Optional[str] = None,
) -> tuple[list[Article], int]:
    """Fetch a paginated article list with optional filters."""
    query = db.query(Article).options(
        joinedload(Article.author),
        joinedload(Article.category),
    )

    if category_id is not None:
        query = query.filter(Article.category_id == category_id)

    if keyword:
        search_text = f"%{keyword}%"
        query = query.filter(
            or_(
                Article.title.like(search_text),
                Article.summary.like(search_text),
                Article.content.like(search_text),
            )
        )

    total = query.count()
    items = (
        query.order_by(Article.created_at.desc())
        .offset((page - 1) * page_size)
        .limit(page_size)
        .all()
    )
    return items, total


def create_article(
    db: Session,
    article_in: ArticleCreate,
    author_id: int,
) -> Article:
    """Create an article owned by the current user."""
    article = Article(
        title=article_in.title,
        summary=article_in.summary,
        content=article_in.content,
        category_id=article_in.category_id,
        author_id=author_id,
    )
    db.add(article)
    db.commit()
    db.refresh(article)
    return get_article_by_id(db, article.id)


def update_article(
    db: Session,
    article: Article,
    article_in: ArticleUpdate,
) -> Article:
    """Update an existing article."""
    update_data = article_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(article, field, value)
    db.commit()
    db.refresh(article)
    return get_article_by_id(db, article.id)


def delete_article(db: Session, article: Article) -> None:
    """Delete an article."""
    db.delete(article)
    db.commit()


def increment_article_view_count(db: Session, article: Article) -> Article:
    """Increase article view count by one and return the fresh record."""
    article.view_count += 1
    db.commit()
    db.refresh(article)
    return get_article_by_id(db, article.id)
