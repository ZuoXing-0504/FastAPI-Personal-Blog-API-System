"""Database engine, session factory, and declarative base."""

from typing import Optional

from sqlalchemy import create_engine
from sqlalchemy.engine import Engine
from sqlalchemy.orm import declarative_base, sessionmaker
from sqlalchemy.pool import StaticPool

from app.core.config import settings


def is_sqlite_url(database_url: str) -> bool:
    """Return whether the given database URL targets SQLite."""
    return database_url.startswith("sqlite")


def is_in_memory_sqlite_url(database_url: str) -> bool:
    """Return whether the given database URL targets an in-memory SQLite DB."""
    return database_url in {"sqlite://", "sqlite:///:memory:"}


def create_db_engine(
    database_url: Optional[str] = None,
    *,
    echo: Optional[bool] = None,
) -> Engine:
    """Create a SQLAlchemy engine for the provided database URL."""
    resolved_database_url = database_url or settings.sqlalchemy_database_uri
    resolved_echo = settings.sql_echo if echo is None else echo

    engine_kwargs = {"echo": resolved_echo}
    if is_sqlite_url(resolved_database_url):
        engine_kwargs["connect_args"] = {"check_same_thread": False}
        if is_in_memory_sqlite_url(resolved_database_url):
            engine_kwargs["poolclass"] = StaticPool
    else:
        engine_kwargs["pool_pre_ping"] = True
        engine_kwargs["pool_recycle"] = 3600

    return create_engine(resolved_database_url, **engine_kwargs)


def create_session_factory(db_engine: Engine) -> sessionmaker:
    """Create a session factory bound to the provided engine."""
    return sessionmaker(
        autocommit=False,
        autoflush=False,
        expire_on_commit=False,
        bind=db_engine,
    )


engine = create_db_engine()
SessionLocal = create_session_factory(engine)
Base = declarative_base()
