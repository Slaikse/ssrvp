.PHONY: install run dev lint clean help

help:
	@echo "BookExchange — команды:"
	@echo "  make install   — установить зависимости"
	@echo "  make run       — запустить сервер"
	@echo "  make dev       — запустить в режиме hot-reload"
	@echo "  make clean     — удалить БД и кэш"

install:
	pip install -r requirements.txt

run:
	python run.py

dev:
	uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

clean:
	find . -type f -name "*.pyc" -delete
	find . -type d -name "__pycache__" -exec rm -rf {} + 2>/dev/null || true
	rm -f bookexchange.db
