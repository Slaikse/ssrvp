from datetime import datetime
from typing import Optional

from pydantic import BaseModel, field_validator

from app.schemas.user import UserResponse
from app.schemas.book import BookResponse


class ExchangeCreate(BaseModel):
    book_wanted_id: int
    book_offered_id: Optional[int] = None
    message: str = ""


class ReviewCreate(BaseModel):
    reviewed_id: int
    exchange_id: int
    rating: int
    comment: str = ""

    @field_validator("rating")
    @classmethod
    def rating_range(cls, v: int) -> int:
        if not (1 <= v <= 5):
            raise ValueError("Оценка должна быть от 1 до 5")
        return v


class ReviewResponse(BaseModel):
    id: int
    reviewer_id: int
    reviewed_id: int
    exchange_id: int
    rating: int
    comment: str
    created_at: datetime
    reviewer: UserResponse

    model_config = {"from_attributes": True}


class ExchangeResponse(BaseModel):
    id: int
    proposer_id: int
    book_wanted_id: int
    book_offered_id: Optional[int]
    message: str
    status: str
    created_at: datetime
    updated_at: datetime
    proposer: UserResponse
    book_wanted: BookResponse
    book_offered: Optional[BookResponse]
    review: Optional[ReviewResponse] = None

    model_config = {"from_attributes": True}
