from datetime import datetime

from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Text
from sqlalchemy.orm import relationship

from app.database import Base


class ExchangeRequest(Base):
    __tablename__ = "exchange_requests"

    id = Column(Integer, primary_key=True, index=True)
    proposer_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    book_wanted_id = Column(Integer, ForeignKey("books.id"), nullable=False)
    book_offered_id = Column(Integer, ForeignKey("books.id"), nullable=True)
    message = Column(Text, default="")
    status = Column(String, default="pending")
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    proposer = relationship("User", back_populates="sent_exchanges", foreign_keys=[proposer_id])
    book_wanted = relationship("Book", back_populates="exchange_requests", foreign_keys=[book_wanted_id])
    book_offered = relationship("Book", back_populates="offered_in", foreign_keys=[book_offered_id])
    review = relationship("Review", back_populates="exchange", uselist=False)


class Review(Base):
    __tablename__ = "reviews"

    id = Column(Integer, primary_key=True, index=True)
    reviewer_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    reviewed_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    exchange_id = Column(Integer, ForeignKey("exchange_requests.id"), nullable=False)
    rating = Column(Integer, nullable=False)
    comment = Column(Text, default="")
    created_at = Column(DateTime, default=datetime.utcnow)

    reviewer = relationship("User", foreign_keys=[reviewer_id])
    reviewed_user = relationship("User", back_populates="reviews_received", foreign_keys=[reviewed_id])
    exchange = relationship("ExchangeRequest", back_populates="review")
