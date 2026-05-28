import pathlib

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.database import Base, engine
from app.routers import auth, books, exchanges, users

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="BookExchange API",
    description="REST API сервиса обмена книгами",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/auth", tags=["Авторизация"])
app.include_router(books.router, prefix="/api/books", tags=["Книги"])
app.include_router(exchanges.router, prefix="/api/exchanges", tags=["Обмены"])
app.include_router(users.router, prefix="/api/users", tags=["Пользователи"])

frontend_dir = pathlib.Path(__file__).parent.parent / "frontend"
if frontend_dir.exists():
    app.mount("/", StaticFiles(directory=str(frontend_dir), html=True), name="frontend")
