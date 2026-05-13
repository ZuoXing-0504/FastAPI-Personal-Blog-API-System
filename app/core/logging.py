"""Application logging configuration."""

from __future__ import annotations

import logging
from contextvars import ContextVar, Token
from logging.config import dictConfig
from pathlib import Path

from app.core.config import settings

request_id_context: ContextVar[str] = ContextVar("request_id", default="-")
_LOGGING_CONFIGURED = False


class RequestIdFilter(logging.Filter):
    """Inject the current request id into log records."""

    def filter(self, record: logging.LogRecord) -> bool:
        record.request_id = request_id_context.get("-")
        return True


def set_request_id(request_id: str) -> Token[str]:
    """Store the current request id in a context variable."""
    return request_id_context.set(request_id)


def reset_request_id(token: Token[str]) -> None:
    """Reset the request id context variable."""
    request_id_context.reset(token)


def configure_logging() -> None:
    """Configure application logging once for the current process."""
    global _LOGGING_CONFIGURED
    if _LOGGING_CONFIGURED:
        return

    handlers: dict[str, dict[str, object]] = {
        "console": {
            "class": "logging.StreamHandler",
            "level": settings.log_level.upper(),
            "formatter": "standard",
            "filters": ["request_id"],
        },
    }

    root_handlers = ["console"]
    if settings.enable_file_logging:
        Path(settings.log_dir).mkdir(parents=True, exist_ok=True)
        handlers["file"] = {
            "class": "logging.FileHandler",
            "level": settings.log_level.upper(),
            "formatter": "standard",
            "filters": ["request_id"],
            "filename": str(Path(settings.log_dir) / "app.log"),
            "encoding": "utf-8",
        }
        root_handlers.append("file")

    dictConfig(
        {
            "version": 1,
            "disable_existing_loggers": False,
            "filters": {
                "request_id": {
                    "()": "app.core.logging.RequestIdFilter",
                },
            },
            "formatters": {
                "standard": {
                    "format": "%(asctime)s | %(levelname)s | %(name)s | request_id=%(request_id)s | %(message)s",
                },
            },
            "handlers": handlers,
            "loggers": {
                "httpx": {
                    "level": "WARNING",
                    "handlers": root_handlers,
                    "propagate": False,
                },
                "httpcore": {
                    "level": "WARNING",
                    "handlers": root_handlers,
                    "propagate": False,
                },
            },
            "root": {
                "level": settings.log_level.upper(),
                "handlers": root_handlers,
            },
        }
    )
    _LOGGING_CONFIGURED = True
