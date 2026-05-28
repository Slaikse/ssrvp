"""
Seed script — creates test users, books and one exchange.
Run once: python seed.py
"""
import sys, os
sys.path.insert(0, os.path.dirname(__file__))

import bcrypt
from app.database import SessionLocal, Base, engine
from app.models.user import User
from app.models.book import Book
from app.models.exchange import ExchangeRequest, Review

Base.metadata.create_all(bind=engine)

def hp(pwd: str) -> str:
    return bcrypt.hashpw(pwd.encode(), bcrypt.gensalt()).decode()

db = SessionLocal()

# ── Чистим старые тестовые данные ────────────────────────────────────────────
emails = ["alice@test.ru", "bob@test.ru", "carol@test.ru"]
existing = db.query(User).filter(User.email.in_(emails)).all()
if existing:
    print("Тестовые пользователи уже есть, пропускаем.")
    db.close()
    sys.exit(0)

# ── Пользователи ─────────────────────────────────────────────────────────────
alice = User(
    email="alice@test.ru", username="alice_reads",
    password_hash=hp("password123"),
    full_name="Алиса Смирнова", city="Москва",
    bio="Люблю классику и современную прозу. Обменяю что угодно на хорошую фантастику!",
    rating=4.8, reviews_count=3,
)
bob = User(
    email="bob@test.ru", username="bob_books",
    password_hash=hp("password123"),
    full_name="Борис Козлов", city="Санкт-Петербург",
    bio="Читаю детективы и научпоп. Всегда готов к обмену.",
    rating=4.5, reviews_count=2,
)
carol = User(
    email="carol@test.ru", username="carol_fantasy",
    password_hash=hp("password123"),
    full_name="Каролина Петрова", city="Екатеринбург",
    bio="Фанат фэнтези и фантастики. Собрала огромную библиотеку — готова делиться!",
    rating=5.0, reviews_count=1,
)
db.add_all([alice, bob, carol])
db.flush()

# ── Книги ─────────────────────────────────────────────────────────────────────
books = [
    # Alice
    Book(owner_id=alice.id, title="Мастер и Маргарита", author="Михаил Булгаков",
         genre="fiction", condition="good", status="available",
         description="Культовый роман о визите дьявола в советскую Москву. Читала несколько раз, состояние хорошее."),
    Book(owner_id=alice.id, title="Преступление и наказание", author="Фёдор Достоевский",
         genre="fiction", condition="fair", status="available",
         description="Классика русской литературы. Немного потрёпана, но текст читается отлично."),
    Book(owner_id=alice.id, title="Анна Каренина", author="Лев Толстой",
         genre="fiction", condition="new", status="available",
         description="Новое издание, прочитала один раз. Отличное состояние."),

    # Bob
    Book(owner_id=bob.id, title="Шерлок Холмс. Полное собрание", author="Артур Конан Дойл",
         genre="detective", condition="good", status="available",
         description="Полное собрание рассказов о Холмсе. Классика детектива!"),
    Book(owner_id=bob.id, title="Краткая история времени", author="Стивен Хокинг",
         genre="science", condition="good", status="available",
         description="Популярная физика от великого учёного. Книга в отличном состоянии."),
    Book(owner_id=bob.id, title="Sapiens: Краткая история человечества", author="Юваль Ной Харари",
         genre="history", condition="new", status="available",
         description="Бестселлер о истории человечества. Прочитал дважды — очень рекомендую!"),
    Book(owner_id=bob.id, title="Убийство в «Восточном экспрессе»", author="Агата Кристи",
         genre="detective", condition="good", status="available",
         description="Классический детектив Кристи. Одна из лучших книг серии о Пуаро."),

    # Carol
    Book(owner_id=carol.id, title="Властелин Колец", author="Дж. Р. Р. Толкин",
         genre="fantasy", condition="good", status="available",
         description="Трилогия в одном томе. Немного пожелтевшие страницы, но это придаёт шарм!"),
    Book(owner_id=carol.id, title="Игра престолов", author="Джордж Р. Р. Мартин",
         genre="fantasy", condition="new", status="available",
         description="Первая книга цикла «Песнь льда и пламени». Куплена недавно, прочитана один раз."),
    Book(owner_id=carol.id, title="Дюна", author="Фрэнк Герберт",
         genre="fantasy", condition="good", status="available",
         description="Эпическая научная фантастика. Один из моих любимых романов всех времён."),
    Book(owner_id=carol.id, title="Гарри Поттер и философский камень", author="Дж. К. Роулинг",
         genre="fantasy", condition="fair", status="available",
         description="Первая книга о Гарри Поттере. Читала в детстве, немного потрёпана."),
    Book(owner_id=carol.id, title="Автостопом по галактике", author="Дуглас Адамс",
         genre="fantasy", condition="good", status="available",
         description="Гениальная юмористическая фантастика. Обязательна к прочтению!"),
]
db.add_all(books)
db.flush()

# ── Один завершённый обмен с отзывом ─────────────────────────────────────────
ex = ExchangeRequest(
    proposer_id=bob.id,
    book_wanted_id=books[0].id,   # Мастер и Маргарита (alice)
    book_offered_id=books[3].id,  # Шерлок Холмс (bob)
    message="Привет! Давно хочу прочитать Булгакова, предлагаю в обмен Холмса. Могу встретиться в центре.",
    status="completed",
)
books[0].status = "exchanged"
books[3].status = "exchanged"
db.add(ex)
db.flush()

review = Review(
    reviewer_id=bob.id,
    reviewed_id=alice.id,
    exchange_id=ex.id,
    rating=5,
    comment="Алиса — отличный партнёр по обмену! Книга в прекрасном состоянии, встретились быстро. Рекомендую!",
)
db.add(review)

db.commit()
print(f"✅ Создано: 3 пользователя, {len(books)} книг, 1 обмен, 1 отзыв")
print()
print("Тестовые аккаунты (пароль у всех: password123):")
print("  alice@test.ru  — Алиса Смирнова, Москва")
print("  bob@test.ru    — Борис Козлов, Санкт-Петербург")
print("  carol@test.ru  — Каролина Петрова, Екатеринбург")
db.close()
