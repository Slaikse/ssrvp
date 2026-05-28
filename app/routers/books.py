from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.auth import get_current_user, get_current_user_optional
from app.database import get_db
from app.models.book import Book
from app.models.user import User
from app.schemas.book import BookCreate, BookUpdate, BookResponse

router = APIRouter()


@router.get("/", response_model=list[BookResponse])
def list_books(
    search: Optional[str] = Query(None),
    genre: Optional[str] = Query(None),
    city: Optional[str] = Query(None),
    condition: Optional[str] = Query(None),
    status: Optional[str] = Query("available"),
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
):
    query = db.query(Book).join(User, Book.owner_id == User.id)

    if status:
        query = query.filter(Book.status == status)
    if search:
        like = f"%{search}%"
        query = query.filter(Book.title.ilike(like) | Book.author.ilike(like))
    if genre and genre != "all":
        query = query.filter(Book.genre == genre)
    if condition and condition != "all":
        query = query.filter(Book.condition == condition)
    if city:
        query = query.filter(User.city.ilike(f"%{city}%"))

    return query.order_by(Book.created_at.desc()).offset(skip).limit(limit).all()


@router.post("/", response_model=BookResponse, status_code=201)
def create_book(
    data: BookCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    book = Book(
        owner_id=current_user.id,
        title=data.title,
        author=data.author,
        genre=data.genre,
        condition=data.condition,
        description=data.description,
    )
    db.add(book)
    db.commit()
    db.refresh(book)
    return book


@router.get("/{book_id}", response_model=BookResponse)
def get_book(book_id: int, db: Session = Depends(get_db)):
    book = db.query(Book).filter(Book.id == book_id).first()
    if not book:
        raise HTTPException(status_code=404, detail="Книга не найдена")
    return book


@router.put("/{book_id}", response_model=BookResponse)
def update_book(
    book_id: int,
    data: BookUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    book = db.query(Book).filter(Book.id == book_id).first()
    if not book:
        raise HTTPException(status_code=404, detail="Книга не найдена")
    if book.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Нет доступа")

    for field, value in data.model_dump(exclude_none=True).items():
        setattr(book, field, value)
    db.commit()
    db.refresh(book)
    return book


@router.delete("/{book_id}", status_code=204)
def delete_book(
    book_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    book = db.query(Book).filter(Book.id == book_id).first()
    if not book:
        raise HTTPException(status_code=404, detail="Книга не найдена")
    if book.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Нет доступа")
    if book.status == "in_exchange":
        raise HTTPException(status_code=400, detail="Нельзя удалить книгу в процессе обмена")

    db.delete(book)
    db.commit()
