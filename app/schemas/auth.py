"""Authentication response schemas."""

from pydantic import Field

from app.schemas.common import BaseSchema
from app.schemas.user import UserPublic


class LoginResponseData(BaseSchema):
    """Payload returned after a successful login."""

    access_token: str = Field(..., description="JWT access token.")
    token_type: str = Field(default="bearer", description="Authorization scheme.")
    expires_in: int = Field(..., description="Token validity in seconds.")
    user: UserPublic
