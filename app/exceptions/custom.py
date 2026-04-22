"""Custom application exception."""

from typing import Optional


class AppException(Exception):
    """Base exception used for predictable business errors."""

    def __init__(
        self,
        *,
        message: str,
        status_code: int = 400,
        code: Optional[int] = None,
    ) -> None:
        self.message = message
        self.status_code = status_code
        self.code = code if code is not None else status_code
        super().__init__(message)
