"""Refresh token CRUD helpers."""

from datetime import datetime
from typing import Optional

from sqlalchemy.orm import Session, joinedload

from app.core.datetime import utc_now
from app.models.refresh_token import RefreshToken


def create_refresh_token_record(
    db: Session,
    *,
    user_id: int,
    token_id: str,
    expires_at: datetime,
) -> RefreshToken:
    """Persist a refresh token record."""
    token = RefreshToken(
        user_id=user_id,
        token_id=token_id,
        expires_at=expires_at,
    )
    db.add(token)
    db.commit()
    db.refresh(token)
    return token


def get_refresh_token_by_token_id(db: Session, token_id: str) -> Optional[RefreshToken]:
    """Fetch a refresh token record by its token identifier."""
    return (
        db.query(RefreshToken)
        .options(joinedload(RefreshToken.user))
        .filter(RefreshToken.token_id == token_id)
        .first()
    )


def revoke_refresh_token(db: Session, token: RefreshToken) -> RefreshToken:
    """Mark a refresh token as revoked."""
    token.revoked_at = utc_now()
    db.commit()
    db.refresh(token)
    return token
