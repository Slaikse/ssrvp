const BASE = '/api';

function getToken() {
    return localStorage.getItem('token');
}

function getUser() {
    const u = localStorage.getItem('user');
    return u ? JSON.parse(u) : null;
}

function setAuth(token, user) {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
}

function clearAuth() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
}

async function request(method, path, body = null, auth = false) {
    const headers = { 'Content-Type': 'application/json' };
    if (auth) {
        const token = getToken();
        if (token) headers['Authorization'] = `Bearer ${token}`;
    }
    const opts = { method, headers };
    if (body) opts.body = JSON.stringify(body);

    const res = await fetch(BASE + path, opts);

    if (res.status === 204) return null;

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
        const msg = data.detail || 'Что-то пошло не так';
        throw new Error(Array.isArray(msg) ? msg.map(e => e.msg).join('; ') : msg);
    }
    return data;
}

const api = {
    // Auth
    register: (d) => request('POST', '/auth/register', d),
    login:    (d) => request('POST', '/auth/login', d),
    me:       ()  => request('GET',  '/auth/me', null, true),

    // Books
    getBooks:   (params = {}) => {
        const q = new URLSearchParams();
        Object.entries(params).forEach(([k, v]) => { if (v !== null && v !== undefined && v !== '') q.set(k, v); });
        return request('GET', `/books?${q}`);
    },
    getBook:    (id) => request('GET',  `/books/${id}`),
    createBook: (d)  => request('POST', '/books', d, true),
    updateBook: (id, d) => request('PUT', `/books/${id}`, d, true),
    deleteBook: (id)    => request('DELETE', `/books/${id}`, null, true),

    // Users
    getUser:        (id) => request('GET', `/users/${id}`),
    getUserBooks:   (id) => request('GET', `/users/${id}/books`),
    getUserReviews: (id) => request('GET', `/users/${id}/reviews`),
    updateProfile:  (d)  => request('PUT', '/users/me', d, true),

    // Exchanges
    proposeExchange:  (d)  => request('POST', '/exchanges', d, true),
    getExchanges:     ()   => request('GET',  '/exchanges', null, true),
    acceptExchange:   (id) => request('PUT',  `/exchanges/${id}/accept`, null, true),
    rejectExchange:   (id) => request('PUT',  `/exchanges/${id}/reject`, null, true),
    completeExchange: (id) => request('PUT',  `/exchanges/${id}/complete`, null, true),
    cancelExchange:   (id) => request('PUT',  `/exchanges/${id}/cancel`, null, true),

    // Reviews
    createReview: (d) => request('POST', '/exchanges/reviews', d, true),
};
