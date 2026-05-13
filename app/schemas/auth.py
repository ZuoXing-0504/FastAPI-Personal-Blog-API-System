"""Authentication schemas."""

from pydantic import Field

from app.schemas.common import BaseSchema
from app.schemas.user import UserPublic


class LoginResponseData(BaseSchema):
    """Payload returned after a successful login or refresh."""

    access_token: str = Field(..., description="JWT access token.")
    refresh_token: str = Field(..., description="JWT refresh token.")
    token_type: str = Field(default="bearer", description="Authorization scheme.")
    expires_in: int = Field(..., description="Access token validity in seconds.")
    refresh_expires_in: int = Field(..., description="Refresh token validity in seconds.")
    user: UserPublic


class RefreshTokenRequest(BaseSchema):
    """Payload used to refresh a token pair."""

    refresh_token: str = Field(..., min_length=1)


class LogoutRequest(BaseSchema):
    """Payload used to revoke a refresh token."""

    refresh_token: str = Field(..., min_length=1)
