"""FastAPI application entry point."""

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1.api import api_router
from app.core.config import settings
from app.core.response import build_response
from app.db.base import Base
from app.db.database import engine
from app.exceptions.handlers import register_exception_handlers


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Create database tables on startup."""
    Base.metadata.create_all(bind=engine)
    yield


def create_app() -> FastAPI:
    """Create and configure the FastAPI application."""
    app = FastAPI(
        title=settings.app_name,
        version=settings.app_version,
        description=(
            "A personal blog backend project built with FastAPI, MySQL, "
            "SQLAlchemy, JWT authentication, and unified engineering practices."
        ),
        docs_url=settings.docs_url,
        redoc_url=settings.redoc_url,
        openapi_url=settings.openapi_url,
        lifespan=lifespan,
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_allow_origins,
        allow_credentials=settings.cors_allow_credentials,
        allow_methods=settings.cors_allow_methods,
        allow_headers=settings.cors_allow_headers,
    )

    register_exception_handlers(app)
    app.include_router(api_router, prefix=settings.api_v1_prefix)

    @app.get("/", summary="Project overview")
    def root() -> dict:
        """Return project metadata and documentation links."""
        return build_response(
            data={
                "project": settings.app_name,
                "version": settings.app_version,
                "docs_url": settings.docs_url,
                "redoc_url": settings.redoc_url,
                "api_prefix": settings.api_v1_prefix,
            },
            msg="FastAPI 博客后端服务启动成功",
        )

    @app.get("/health", summary="Health check")
    def health_check() -> dict:
        """Simple health check endpoint."""
        return build_response(data={"status": "ok"}, msg="服务运行正常")

    return app


app = create_app()
