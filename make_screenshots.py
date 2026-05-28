"""Run: python make_screenshots.py  (backend must be on :8000)"""
import time, json, requests
from playwright.sync_api import sync_playwright

BASE = "http://localhost:8000"
OUT  = "docs/screenshots"

import os; os.makedirs(OUT, exist_ok=True)

def shot(page, path, wait=1.2):
    time.sleep(wait)
    page.screenshot(path=f"{OUT}/{path}", full_page=True)
    print(f"  saved {path}")

def spa_goto(page, path):
    """Navigate in an already-loaded SPA via React Router."""
    page.evaluate(f"window.history.pushState({{}}, '', '{path}')")
    page.evaluate("window.dispatchEvent(new PopStateEvent('popstate'))")
    time.sleep(1.0)

# -- Get auth token via API
resp = requests.post(
    f"{BASE}/api/auth/login",
    json={"email": "carol@test.ru", "password": "password123"},
    timeout=10,
)
auth = resp.json()
token = auth["access_token"]
user_json = json.dumps(auth["user"])
print(f"  Logged in as {auth['user']['username']}")

with sync_playwright() as pw:
    browser = pw.chromium.launch(headless=True)
    ctx = browser.new_context(viewport={"width": 1440, "height": 900})
    page = ctx.new_page()

    # Bootstrap: load root (React initialises), inject token
    page.goto(BASE)
    page.wait_for_load_state("domcontentloaded")
    time.sleep(1.5)
    page.evaluate(f"""
        localStorage.setItem('token', '{token}');
        localStorage.setItem('user', JSON.stringify({user_json}));
    """)

    # 5. Home (logged in) – hard reload so AuthContext picks up localStorage
    page.reload()
    shot(page, "05_home_logged_in.png", wait=2.0)

    # 6. Catalog
    spa_goto(page, "/catalog")
    shot(page, "02_catalog_logged_in.png")

    # 7. My books
    spa_goto(page, "/my-books")
    shot(page, "06_my_books.png", wait=1.5)

    # 8. Profile
    spa_goto(page, "/profile")
    shot(page, "07_profile.png", wait=2.0)

    # 9. Exchanges
    spa_goto(page, "/exchanges")
    shot(page, "08_exchanges.png", wait=2.0)

    # 10. Book detail (Дюна id=12)
    spa_goto(page, "/books/12")
    shot(page, "03_book_detail.png", wait=1.5)

    browser.close()

print("\nDone! Check docs/screenshots/")
