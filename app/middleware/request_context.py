"""Middleware for request ids and access logs."""

from __future__ import annotations

import logging
from time import perf_counter
from uuid import uuid4

from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request

from app.core.logging import reset_request_id, set_request_id

logger = logging.getLogger("app.request")


class RequestContextMiddleware(BaseHTTPMiddleware):
    """Attach request ids and write basic access logs."""

    async def dispatch(self, request: Request, call_next):
        request_id = request.headers.get("X-Request-ID") or uuid4().hex
        token = set_request_id(request_id)
        request.state.request_id = request_id
        start = perf_counter()
        response = None

        try:
            response = await call_next(request)
            response.headers["X-Request-ID"] = request_id
            return response
        finally:
            duration_ms = (perf_counter() - start) * 1000
            status_code = response.status_code if response is not None else 500
            logger.info(
                "%s %s -> %s (%.2f ms)",
                request.method,
                request.url.path,
                status_code,
                duration_ms,
            )
            reset_request_id(token)
