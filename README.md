# 📚 BookSwap — Сервис обмена книгами

> Платформа для обмена книгами между людьми. Находите читателей рядом с вами, отдавайте прочитанное и получайте новое — бесплатно и без посредников.

---

## 1. О проекте

**BookSwap** — веб-приложение, позволяющее пользователям размещать книги для обмена, искать нужные издания по каталогу и договариваться о встрече для обмена. После завершения обмена участники могут оставить отзывы друг о друге.

### Стек технологий

| Слой | Технологии |
|---|---|
| **Backend** | Python 3.11+, FastAPI, SQLAlchemy 2.0 |
| **База данных** | SQLite (файл `bookexchange.db`) |
| **Аутентификация** | JWT токены (python-jose + passlib/bcrypt) |
| **Frontend** | HTML5, CSS3, Vanilla JS (ES2020), Bootstrap 5 |
| **API документация** | Swagger UI (FastAPI встроенная) |

---

## 2. Философия и пользователи

### Целевая аудитория

**Алексей, 24 года** — студент, много читает, хочет избавляться от прочитанных книг и находить новые. Не хочет тратить деньги, ценит простоту.

**Мария, 35 лет** — домохозяйка, собирает детские книги для ребёнка. Хочет обмениваться с людьми из своего района.

### Какую проблему решает?

Большинство книг после прочтения пылятся на полке. BookSwap даёт им вторую жизнь: один клик — и книга найдёт нового читателя, а взамен придёт та, которую давно хотели прочесть.

---

## 3. Функциональность

### Пользователь

- ✅ Регистрация и авторизация (JWT, токен живёт 30 дней)
- ✅ Профиль с именем, городом, биографией и рейтингом
- ✅ Просмотр профилей других пользователей

### Книги

- ✅ Добавление книги (название, автор, жанр, состояние, описание)
- ✅ Редактирование и удаление своих книг
- ✅ Каталог с поиском по названию / автору
- ✅ Фильтрация по жанру, состоянию, городу
- ✅ Пагинация результатов

### Обмен

- ✅ Предложить обмен на книгу (с предложением своей книги или без)
- ✅ Сообщение к запросу на обмен
- ✅ Принять / отклонить входящий запрос
- ✅ Завершить обмен (оба участника могут подтвердить)
- ✅ Отменить исходящий запрос
- ✅ Автоматическое изменение статуса книги (`available` → `in_exchange` → `exchanged`)

### Отзывы

- ✅ Оставить отзыв после завершённого обмена
- ✅ Оценка от 1 до 5 звёзд + комментарий
- ✅ Автоматический пересчёт среднего рейтинга пользователя

---

## 4. Пользовательские истории (User Stories)

**История 1: Регистрация**
> Как новый пользователь, я хочу быстро создать аккаунт, чтобы сразу начать добавлять книги.

**История 2: Поиск книги**
> Как читатель, я хочу найти книгу по названию или автору и отфильтровать результаты по жанру и городу, чтобы найти удобный вариант для обмена.

**История 3: Предложение обмена**
> Как пользователь, я хочу написать владельцу книги, предложить свою книгу взамен и отправить сообщение, чтобы договориться об обмене.

**История 4: Управление запросами**
> Как владелец книги, я хочу видеть все входящие запросы и принимать или отклонять их, чтобы контролировать процесс обмена.

**История 5: Завершение и отзыв**
> Как участник обмена, после встречи я хочу отметить обмен завершённым и оставить отзыв о партнёре, чтобы другие пользователи знали, кому можно доверять.

---

## 5. Архитектура

```
ssrvp/
├── app/                    # FastAPI приложение
│   ├── main.py             # Точка входа, роутинг, статика
│   ├── config.py           # Настройки (env)
│   ├── database.py         # SQLAlchemy engine + Base + get_db
│   ├── auth.py             # JWT + bcrypt + зависимости
│   ├── models/             # SQLAlchemy ORM модели
│   │   ├── user.py         # User
│   │   ├── book.py         # Book
│   │   └── exchange.py     # ExchangeRequest, Review
│   ├── schemas/            # Pydantic схемы (валидация)
│   │   ├── user.py
│   │   ├── book.py
│   │   └── exchange.py
│   └── routers/            # API эндпоинты
│       ├── auth.py         # /api/auth/*
│       ├── books.py        # /api/books/*
│       ├── exchanges.py    # /api/exchanges/*
│       └── users.py        # /api/users/*
├── frontend/               # Статический фронтенд
│   ├── index.html          # Главная страница
│   ├── catalog.html        # Каталог с фильтрами
│   ├── book.html           # Детальная страница книги
│   ├── my-books.html       # Управление своими книгами
│   ├── exchanges.html      # Входящие/исходящие обмены
│   ├── profile.html        # Профиль пользователя
│   ├── login.html          # Вход
│   ├── register.html       # Регистрация
│   ├── css/style.css       # Кастомные стили + CSS-переменные
│   └── js/
│       ├── api.js          # Все вызовы к API
│       └── utils.js        # Хелперы, компоненты, navbar
├── run.py                  # uvicorn запуск
├── requirements.txt
├── Makefile
└── .env.example
```

### Схема базы данных

```
users
  id, email, username, password_hash, full_name, city, bio, rating, reviews_count, created_at

books
  id, owner_id→users, title, author, genre, condition, status, description, created_at

exchange_requests
  id, proposer_id→users, book_wanted_id→books, book_offered_id→books,
  message, status, created_at, updated_at

reviews
  id, reviewer_id→users, reviewed_id→users, exchange_id→exchange_requests,
  rating, comment, created_at
```

**Статусы книги:** `available` → `in_exchange` → `exchanged`

**Статусы обмена:** `pending` → `accepted` → `completed`  
                                      ↘ `rejected` / `cancelled`

---

## 6. API Reference

Полная интерактивная документация доступна после запуска: **http://localhost:8000/api/docs**

### Авторизация — `/api/auth`

| Метод | Путь | Описание |
|---|---|---|
| `POST` | `/api/auth/register` | Регистрация нового пользователя |
| `POST` | `/api/auth/login` | Вход, возвращает JWT токен |
| `GET` | `/api/auth/me` | Текущий авторизованный пользователь |

### Книги — `/api/books`

| Метод | Путь | Описание |
|---|---|---|
| `GET` | `/api/books` | Список книг (поиск + фильтры + пагинация) |
| `POST` | `/api/books` | Добавить книгу 🔒 |
| `GET` | `/api/books/{id}` | Получить книгу по ID |
| `PUT` | `/api/books/{id}` | Обновить книгу 🔒 |
| `DELETE` | `/api/books/{id}` | Удалить книгу 🔒 |

**Query параметры для `GET /api/books`:**
- `search` — поиск по названию/автору
- `genre` — жанр (fiction, fantasy, detective, science, …)
- `condition` — состояние (new, good, fair, poor)
- `city` — город владельца
- `status` — статус (available, in_exchange, exchanged)
- `skip`, `limit` — пагинация

### Обмены — `/api/exchanges`

| Метод | Путь | Описание |
|---|---|---|
| `POST` | `/api/exchanges` | Предложить обмен 🔒 |
| `GET` | `/api/exchanges` | Мои обмены (входящие + исходящие) 🔒 |
| `GET` | `/api/exchanges/{id}` | Детали обмена 🔒 |
| `PUT` | `/api/exchanges/{id}/accept` | Принять запрос 🔒 |
| `PUT` | `/api/exchanges/{id}/reject` | Отклонить запрос 🔒 |
| `PUT` | `/api/exchanges/{id}/complete` | Завершить обмен 🔒 |
| `PUT` | `/api/exchanges/{id}/cancel` | Отменить запрос 🔒 |
| `POST` | `/api/exchanges/reviews` | Оставить отзыв 🔒 |

### Пользователи — `/api/users`

| Метод | Путь | Описание |
|---|---|---|
| `GET` | `/api/users/{id}` | Профиль пользователя |
| `GET` | `/api/users/{id}/books` | Книги пользователя |
| `GET` | `/api/users/{id}/reviews` | Отзывы о пользователе |
| `PUT` | `/api/users/me` | Обновить свой профиль 🔒 |

> 🔒 — требуется JWT токен в заголовке `Authorization: Bearer <token>`

---

## 7. Быстрый старт

### Требования

- Python 3.11+
- pip

### Установка и запуск

```bash
# 1. Клонировать репозиторий
git clone <repo-url>
cd ssrvp

# 2. Создать виртуальное окружение
python -m venv .venv
source .venv/bin/activate      # Linux / macOS
.venv\Scripts\activate         # Windows

# 3. Установить зависимости
pip install -r requirements.txt

# 4. (Опционально) Настроить переменные окружения
cp .env.example .env
# Отредактируйте .env при необходимости

# 5. Запустить
python run.py
```

Приложение будет доступно на **http://localhost:8000**

| URL | Описание |
|---|---|
| `http://localhost:8000` | Главная страница |
| `http://localhost:8000/catalog.html` | Каталог книг |
| `http://localhost:8000/api/docs` | Swagger UI (API документация) |
| `http://localhost:8000/api/redoc` | ReDoc документация |

> База данных `bookexchange.db` создаётся автоматически при первом запуске.

### Makefile команды

```bash
make install   # pip install -r requirements.txt
make run       # запустить сервер
make dev       # запустить с hot-reload
make clean     # удалить БД и кэш
```

---

## 8. Примеры запросов

### Регистрация

```bash
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","username":"reader42","password":"secret123","city":"Москва"}'
```

### Добавление книги

```bash
curl -X POST http://localhost:8000/api/books \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"title":"Дюна","author":"Фрэнк Герберт","genre":"fiction","condition":"good"}'
```

### Поиск книг

```bash
curl "http://localhost:8000/api/books?search=дюна&genre=fiction&city=Москва"
```

---

## 9. Жанры и состояния

**Жанры:** `fiction` · `nonfiction` · `science` · `history` · `biography` · `children` · `fantasy` · `detective` · `romance` · `other`

**Состояния книги:**
| Код | Описание |
|---|---|
| `new` | Новая, не читалась |
| `good` | Хорошее — без видимых дефектов |
| `fair` | Удовлетворительное — небольшие потёртости |
| `poor` | Плохое — читаемо, но видны следы использования |

---

## 10. Скриншоты

| Страница | Описание |
|---|---|
| `/ (index.html)` | Главная: герой-секция, поиск, свежие книги, жанры |
| `/catalog.html` | Каталог с боковыми фильтрами и пагинацией |
| `/book.html` | Детальная страница книги, кнопка обмена |
| `/my-books.html` | Управление своими книгами (CRUD) |
| `/exchanges.html` | Обмены: вкладки Входящие / Исходящие / Завершённые |
| `/profile.html` | Профиль пользователя: книги, рейтинг, отзывы |

---

## 11. Переменные окружения

| Переменная | По умолчанию | Описание |
|---|---|---|
| `DATABASE_URL` | `sqlite:///./bookexchange.db` | URL базы данных |
| `SECRET_KEY` | *(строка)* | Секрет для подписи JWT |
| `ALGORITHM` | `HS256` | Алгоритм JWT |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | `43200` (30 дней) | Время жизни токена |

---

*Учебный проект. 2025.*
