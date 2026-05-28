from datetime import datetime

from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship

from app.database import Base


class Book(Base):
    __tablename__ = "books"

    id = Column(Integer, primary_key=True, index=True)
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String, nullable=False, index=True)
    author = Column(String, nullable=False)
    genre = Column(String, default="other")
    condition = Column(String, default="good")
    description = Column(String, default="")
    status = Column(String, default="available")
    created_at = Column(DateTime, default=datetime.utcnow)

    owner = relationship("User", back_populates="books", foreign_keys=[owner_id])
    exchange_requests = relationship(
        "ExchangeRequest",
        back_populates="book_wanted",
        foreign_keys="ExchangeRequest.book_wanted_id",
    )
    offered_in = relationship(
        "ExchangeRequest",
        back_populates="book_offered",
        foreign_keys="ExchangeRequest.book_offered_id",
    )
