"""Security helpers for password hashing and JWT handling."""

from datetime import timedelta
from typing import Any, Optional
from uuid import uuid4

import jwt
from passlib.context import CryptContext

from app.core.config import settings
from app.core.datetime import utc_now

# Use PBKDF2-SHA256 to avoid passlib/bcrypt compatibility issues on newer
# Python and bcrypt versions while still providing salted secure hashing.
pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a plain password against a stored hash."""
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    """Hash a password before storing it in the database."""
    return pwd_context.hash(password)


def _create_token(
    *,
    subject: Any,
    token_type: str,
    expires_delta: timedelta,
    token_id: Optional[str] = None,
) -> str:
    """Create a signed JWT token with the provided claims."""
    issued_at = utc_now()
    expire = issued_at + expires_delta
    payload = {
        "sub": str(subject),
        "type": token_type,
        "exp": expire,
        "iat": issued_at,
    }
    if token_id:
        payload["jti"] = token_id
    return jwt.encode(
        payload,
        settings.jwt_secret_key,
        algorithm=settings.jwt_algorithm,
    )


def create_access_token(subject: Any, expires_delta: Optional[timedelta] = None) -> str:
    """Create a signed JWT access token."""
    return _create_token(
        subject=subject,
        token_type="access",
        expires_delta=(
            expires_delta or timedelta(minutes=settings.access_token_expire_minutes)
        ),
    )


def create_refresh_token(subject: Any, token_id: str, expires_delta: Optional[timedelta] = None) -> str:
    """Create a signed JWT refresh token."""
    return _create_token(
        subject=subject,
        token_type="refresh",
        token_id=token_id,
        expires_delta=(
            expires_delta or timedelta(days=settings.refresh_token_expire_days)
        ),
    )


def generate_token_id() -> str:
    """Generate a unique token identifier."""
    return str(uuid4())


def decode_access_token(token: str) -> dict[str, Any]:
    """Decode and validate a JWT access token."""
    return jwt.decode(
        token,
        settings.jwt_secret_key,
        algorithms=[settings.jwt_algorithm],
    )
