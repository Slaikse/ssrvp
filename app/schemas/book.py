from datetime import datetime
from typing import Optional

from pydantic import BaseModel, field_validator

from app.schemas.user import UserResponse

VALID_GENRES = {"fiction", "nonfiction", "science", "history", "biography", "children", "fantasy", "detective", "romance", "other"}
VALID_CONDITIONS = {"new", "good", "fair", "poor"}
VALID_STATUSES = {"available", "in_exchange", "exchanged"}


class BookCreate(BaseModel):
    title: str
    author: str
    genre: str = "other"
    condition: str = "good"
    description: str = ""

    @field_validator("title", "author")
    @classmethod
    def not_empty(cls, v: str) -> str:
        v = v.strip()
        if not v:
            raise ValueError("Поле не может быть пустым")
        return v

    @field_validator("genre")
    @classmethod
    def valid_genre(cls, v: str) -> str:
        return v if v in VALID_GENRES else "other"

    @field_validator("condition")
    @classmethod
    def valid_condition(cls, v: str) -> str:
        return v if v in VALID_CONDITIONS else "good"


class BookUpdate(BaseModel):
    title: Optional[str] = None
    author: Optional[str] = None
    genre: Optional[str] = None
    condition: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None

    @field_validator("status")
    @classmethod
    def valid_status(cls, v: Optional[str]) -> Optional[str]:
        if v is not None and v not in VALID_STATUSES:
            raise ValueError("Некорректный статус")
        return v


class BookResponse(BaseModel):
    id: int
    owner_id: int
    title: str
    author: str
    genre: str
    condition: str
    description: str
    status: str
    created_at: datetime
    owner: UserResponse

    model_config = {"from_attributes": True}
