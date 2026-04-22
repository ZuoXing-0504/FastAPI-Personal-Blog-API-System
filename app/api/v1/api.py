"""API v1 router aggregation."""

from fastapi import APIRouter

from app.api.v1.endpoints import articles, auth, categories, users

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
api_router.include_router(users.router, prefix="/users", tags=["Users"])
api_router.include_router(categories.router, prefix="/categories", tags=["Categories"])
api_router.include_router(articles.router, prefix="/articles", tags=["Articles"])
