// ─── Book cover colors ───
const COVER_COLORS = [
    ['#2C5F2E', '#1A3D1B'],
    ['#1A3D8F', '#0E2456'],
    ['#8B2252', '#5C1636'],
    ['#7B3F00', '#4E2800'],
    ['#4A4A8A', '#2D2D5C'],
    ['#1A6B6B', '#0E4040'],
    ['#8B4513', '#5C2D0D'],
    ['#2C4770', '#162440'],
    ['#6B2D6B', '#3D173D'],
    ['#1B6B3A', '#0E3D20'],
];

function getColorForText(text) {
    let hash = 0;
    for (let i = 0; i < text.length; i++) hash = text.charCodeAt(i) + ((hash << 5) - hash);
    return COVER_COLORS[Math.abs(hash) % COVER_COLORS.length];
}

function bookCoverStyle(title) {
    const [c1, c2] = getColorForText(title);
    return `background: linear-gradient(145deg, ${c1}, ${c2})`;
}

function firstLetter(text) {
    return (text || '?').charAt(0).toUpperCase();
}

function avatarColor(username) {
    const colors = ['#2C5F2E','#1A3D8F','#8B2252','#7B3F00','#4A4A8A','#1A6B6B','#8B4513'];
    let h = 0;
    for (let i = 0; i < username.length; i++) h = username.charCodeAt(i) + ((h << 5) - h);
    return colors[Math.abs(h) % colors.length];
}

// ─── Display helpers ───
const GENRE_LABELS = {
    fiction: 'Художественная', nonfiction: 'Нон-фикшн', science: 'Наука',
    history: 'История', biography: 'Биография', children: 'Детская',
    fantasy: 'Фэнтези', detective: 'Детектив', romance: 'Романтика', other: 'Другое',
};
const CONDITION_LABELS = {
    new: 'Новая', good: 'Хорошее', fair: 'Удовлетворительное', poor: 'Плохое',
};
const STATUS_LABELS = {
    available: 'Доступна', in_exchange: 'В обмене', exchanged: 'Обменяна',
};
const EXCHANGE_STATUS_LABELS = {
    pending: 'Ожидает', accepted: 'Принят', rejected: 'Отклонён',
    completed: 'Завершён', cancelled: 'Отменён',
};
const EXCHANGE_STATUS_CLASS = {
    pending: 'warning', accepted: 'info', rejected: 'danger', completed: 'success', cancelled: 'secondary',
};

function genreLabel(g)     { return GENRE_LABELS[g]     || g; }
function conditionLabel(c) { return CONDITION_LABELS[c] || c; }
function statusLabel(s)    { return STATUS_LABELS[s]    || s; }
function exchangeStatusLabel(s) { return EXCHANGE_STATUS_LABELS[s] || s; }
function exchangeStatusClass(s) { return EXCHANGE_STATUS_CLASS[s]  || 'secondary'; }

function formatDate(iso) {
    if (!iso) return '';
    return new Date(iso).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
}

function starsHtml(rating) {
    const r = Math.round(rating);
    return Array.from({length: 5}, (_, i) =>
        `<span class="star">${i < r ? '★' : '☆'}</span>`
    ).join('');
}

// ─── Book card HTML ───
function bookCardHtml(book, linkPrefix = 'book.html') {
    const coverStyle = bookCoverStyle(book.title);
    const letter = firstLetter(book.title);
    const ownerColor = avatarColor(book.owner.username);
    const ownerName = book.owner.full_name || book.owner.username;
    const city = book.owner.city ? `· ${book.owner.city}` : '';

    return `
    <div class="book-card" onclick="location.href='${linkPrefix}?id=${book.id}'">
        <div class="book-cover" style="${coverStyle}">
            <span class="book-cover-letter">${letter}</span>
        </div>
        <div class="book-body">
            <div class="book-title">${escHtml(book.title)}</div>
            <div class="book-author">${escHtml(book.author)}</div>
            <div class="book-meta">
                <span class="badge-genre">${genreLabel(book.genre)}</span>
                <span class="badge-condition ${book.condition}">${conditionLabel(book.condition)}</span>
            </div>
            <div class="book-owner">
                <span class="avatar sm" style="background:${ownerColor}">${firstLetter(book.owner.username)}</span>
                <span>${escHtml(ownerName)} ${city}</span>
            </div>
        </div>
    </div>`;
}

// ─── Toast ───
function toast(msg, type = 'default') {
    const icons = { success: '✓', error: '✕', warning: '⚠', default: 'ℹ' };
    const container = document.getElementById('toast-container') || (() => {
        const d = document.createElement('div');
        d.id = 'toast-container';
        document.body.appendChild(d);
        return d;
    })();

    const el = document.createElement('div');
    el.className = `toast-msg ${type}`;
    el.innerHTML = `<span>${icons[type] || 'ℹ'}</span> ${escHtml(msg)}`;
    container.appendChild(el);
    setTimeout(() => el.remove(), 3500);
}

// ─── Escape HTML ───
function escHtml(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

// ─── Navbar auth state ───
function initNavbar() {
    const user = getUser();
    const guestLinks  = document.getElementById('nav-guest');
    const authLinks   = document.getElementById('nav-auth');
    const userDisplay = document.getElementById('nav-username');
    const userAvatar  = document.getElementById('nav-avatar');

    if (user) {
        if (guestLinks)  guestLinks.style.display  = 'none';
        if (authLinks)   authLinks.style.display   = 'flex';
        if (userDisplay) userDisplay.textContent   = user.username;
        if (userAvatar)  {
            userAvatar.textContent = firstLetter(user.username);
            userAvatar.style.background = avatarColor(user.username);
        }
    } else {
        if (guestLinks) guestLinks.style.display  = 'flex';
        if (authLinks)  authLinks.style.display   = 'none';
    }
}

function logout() {
    clearAuth();
    location.href = '/';
}

function requireAuth() {
    if (!getUser()) { location.href = '/login.html'; return false; }
    return true;
}

function getQueryParam(name) {
    return new URLSearchParams(location.search).get(name);
}
