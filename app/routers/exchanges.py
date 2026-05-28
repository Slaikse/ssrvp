from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.auth import get_current_user
from app.database import get_db
from app.models.book import Book
from app.models.exchange import ExchangeRequest, Review
from app.models.user import User
from app.schemas.exchange import ExchangeCreate, ExchangeResponse, ReviewCreate, ReviewResponse

router = APIRouter()


def _get_exchange_or_404(exchange_id: int, db: Session) -> ExchangeRequest:
    ex = db.query(ExchangeRequest).filter(ExchangeRequest.id == exchange_id).first()
    if not ex:
        raise HTTPException(status_code=404, detail="Запрос на обмен не найден")
    return ex


@router.post("/", response_model=ExchangeResponse, status_code=201)
def propose_exchange(
    data: ExchangeCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    book_wanted = db.query(Book).filter(Book.id == data.book_wanted_id).first()
    if not book_wanted:
        raise HTTPException(status_code=404, detail="Книга не найдена")
    if book_wanted.owner_id == current_user.id:
        raise HTTPException(status_code=400, detail="Нельзя предложить обмен на свою книгу")
    if book_wanted.status != "available":
        raise HTTPException(status_code=400, detail="Книга недоступна для обмена")

    if data.book_offered_id:
        book_offered = db.query(Book).filter(Book.id == data.book_offered_id).first()
        if not book_offered:
            raise HTTPException(status_code=404, detail="Предлагаемая книга не найдена")
        if book_offered.owner_id != current_user.id:
            raise HTTPException(status_code=403, detail="Это не ваша книга")
        if book_offered.status != "available":
            raise HTTPException(status_code=400, detail="Предлагаемая книга недоступна")

    existing = (
        db.query(ExchangeRequest)
        .filter(
            ExchangeRequest.proposer_id == current_user.id,
            ExchangeRequest.book_wanted_id == data.book_wanted_id,
            ExchangeRequest.status == "pending",
        )
        .first()
    )
    if existing:
        raise HTTPException(status_code=400, detail="Вы уже отправили запрос на эту книгу")

    exchange = ExchangeRequest(
        proposer_id=current_user.id,
        book_wanted_id=data.book_wanted_id,
        book_offered_id=data.book_offered_id,
        message=data.message,
    )
    db.add(exchange)

    if data.book_offered_id:
        book_offered.status = "in_exchange"

    db.commit()
    db.refresh(exchange)
    return exchange


@router.get("/", response_model=list[ExchangeResponse])
def get_my_exchanges(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    sent = db.query(ExchangeRequest).filter(ExchangeRequest.proposer_id == current_user.id).all()
    received = (
        db.query(ExchangeRequest)
        .join(Book, ExchangeRequest.book_wanted_id == Book.id)
        .filter(Book.owner_id == current_user.id)
        .all()
    )
    seen = set()
    result = []
    for ex in sent + received:
        if ex.id not in seen:
            seen.add(ex.id)
            result.append(ex)
    result.sort(key=lambda x: x.created_at, reverse=True)
    return result


@router.get("/{exchange_id}", response_model=ExchangeResponse)
def get_exchange(
    exchange_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    ex = _get_exchange_or_404(exchange_id, db)
    is_proposer = ex.proposer_id == current_user.id
    is_owner = ex.book_wanted.owner_id == current_user.id
    if not (is_proposer or is_owner):
        raise HTTPException(status_code=403, detail="Нет доступа")
    return ex


@router.put("/{exchange_id}/accept", response_model=ExchangeResponse)
def accept_exchange(
    exchange_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    ex = _get_exchange_or_404(exchange_id, db)
    if ex.book_wanted.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Нет доступа")
    if ex.status != "pending":
        raise HTTPException(status_code=400, detail="Запрос уже обработан")

    ex.status = "accepted"
    ex.book_wanted.status = "in_exchange"
    ex.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(ex)
    return ex


@router.put("/{exchange_id}/reject", response_model=ExchangeResponse)
def reject_exchange(
    exchange_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    ex = _get_exchange_or_404(exchange_id, db)
    if ex.book_wanted.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Нет доступа")
    if ex.status != "pending":
        raise HTTPException(status_code=400, detail="Запрос уже обработан")

    ex.status = "rejected"
    if ex.book_offered_id and ex.book_offered:
        ex.book_offered.status = "available"
    ex.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(ex)
    return ex


@router.put("/{exchange_id}/complete", response_model=ExchangeResponse)
def complete_exchange(
    exchange_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    ex = _get_exchange_or_404(exchange_id, db)
    is_proposer = ex.proposer_id == current_user.id
    is_owner = ex.book_wanted.owner_id == current_user.id
    if not (is_proposer or is_owner):
        raise HTTPException(status_code=403, detail="Нет доступа")
    if ex.status != "accepted":
        raise HTTPException(status_code=400, detail="Обмен не принят")

    ex.status = "completed"
    ex.book_wanted.status = "exchanged"
    if ex.book_offered_id and ex.book_offered:
        ex.book_offered.status = "exchanged"
    ex.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(ex)
    return ex


@router.put("/{exchange_id}/cancel", response_model=ExchangeResponse)
def cancel_exchange(
    exchange_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    ex = _get_exchange_or_404(exchange_id, db)
    if ex.proposer_id != current_user.id:
        raise HTTPException(status_code=403, detail="Нет доступа")
    if ex.status not in ("pending", "accepted"):
        raise HTTPException(status_code=400, detail="Нельзя отменить этот запрос")

    was_accepted = ex.status == "accepted"
    ex.status = "cancelled"
    if ex.book_offered_id and ex.book_offered:
        ex.book_offered.status = "available"
    if was_accepted and ex.book_wanted:
        ex.book_wanted.status = "available"
    ex.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(ex)
    return ex


@router.post("/reviews", response_model=ReviewResponse, status_code=201)
def create_review(
    data: ReviewCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    ex = db.query(ExchangeRequest).filter(ExchangeRequest.id == data.exchange_id).first()
    if not ex:
        raise HTTPException(status_code=404, detail="Обмен не найден")
    if ex.status != "completed":
        raise HTTPException(status_code=400, detail="Обмен не завершён")

    is_proposer = ex.proposer_id == current_user.id
    is_owner = ex.book_wanted.owner_id == current_user.id
    if not (is_proposer or is_owner):
        raise HTTPException(status_code=403, detail="Нет доступа")

    if db.query(Review).filter(Review.exchange_id == data.exchange_id, Review.reviewer_id == current_user.id).first():
        raise HTTPException(status_code=400, detail="Вы уже оставили отзыв")

    reviewed_user = db.query(User).filter(User.id == data.reviewed_id).first()
    if not reviewed_user:
        raise HTTPException(status_code=404, detail="Пользователь не найден")

    review = Review(
        reviewer_id=current_user.id,
        reviewed_id=data.reviewed_id,
        exchange_id=data.exchange_id,
        rating=data.rating,
        comment=data.comment,
    )
    db.add(review)

    all_reviews = db.query(Review).filter(Review.reviewed_id == data.reviewed_id).all()
    total = sum(r.rating for r in all_reviews) + data.rating
    count = len(all_reviews) + 1
    reviewed_user.rating = round(total / count, 2)
    reviewed_user.reviews_count = count

    db.commit()
    db.refresh(review)
    return review
