from datetime import datetime

from sqlalchemy import Column, Integer, String, Float, DateTime
from sqlalchemy.orm import relationship

from app.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    username = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    full_name = Column(String, default="")
    city = Column(String, default="")
    bio = Column(String, default="")
    rating = Column(Float, default=0.0)
    reviews_count = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)

    books = relationship("Book", back_populates="owner", foreign_keys="Book.owner_id")
    sent_exchanges = relationship(
        "ExchangeRequest", back_populates="proposer", foreign_keys="ExchangeRequest.proposer_id"
    )
    reviews_received = relationship(
        "Review", back_populates="reviewed_user", foreign_keys="Review.reviewed_id"
    )
