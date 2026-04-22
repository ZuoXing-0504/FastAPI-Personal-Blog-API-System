"""User schemas."""

from datetime import datetime
import re

from pydantic import EmailStr, Field, field_validator

from app.schemas.common import BaseSchema

USERNAME_PATTERN = re.compile(r"^[A-Za-z0-9_]{3,20}$")


class UserCreate(BaseSchema):
    """Schema used when registering a user."""

    username: str = Field(..., max_length=20)
    email: EmailStr
    password: str = Field(..., max_length=32)

    @field_validator("username")
    @classmethod
    def validate_username(cls, value: str) -> str:
        """Ensure username format is interview-project friendly."""
        username = value.strip()
        if not USERNAME_PATTERN.fullmatch(username):
            raise ValueError("用户名必须为 3-20 位字母、数字或下划线")
        return username

    @field_validator("password")
    @classmethod
    def validate_password(cls, value: str) -> str:
        """Ensure password has a basic secure format."""
        password = value.strip()
        if len(password) < 6 or len(password) > 32:
            raise ValueError("密码长度必须为 6-32 位")
        if not any(char.isalpha() for char in password) or not any(
            char.isdigit() for char in password
        ):
            raise ValueError("密码必须同时包含字母和数字")
        return password


class UserLogin(BaseSchema):
    """Schema used when logging in."""

    username: str = Field(..., max_length=20)
    password: str = Field(..., max_length=32)

    @field_validator("username")
    @classmethod
    def normalize_username(cls, value: str) -> str:
        """Normalize login username."""
        username = value.strip()
        if not username:
            raise ValueError("用户名不能为空")
        return username

    @field_validator("password")
    @classmethod
    def normalize_password(cls, value: str) -> str:
        """Normalize login password."""
        password = value.strip()
        if not password:
            raise ValueError("密码不能为空")
        return password


class UserSummary(BaseSchema):
    """Compact user information embedded in article responses."""

    id: int
    username: str


class UserPublic(BaseSchema):
    """User information safe to expose to clients."""

    id: int
    username: str
    email: EmailStr
    is_active: bool
    created_at: datetime
    updated_at: datetime
