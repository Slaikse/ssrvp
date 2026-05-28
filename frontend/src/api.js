const BASE = '/api'

function getToken() {
  return localStorage.getItem('token')
}

async function req(method, path, body = null, auth = false) {
  const headers = { 'Content-Type': 'application/json' }
  if (auth) {
    const t = getToken()
    if (t) headers['Authorization'] = `Bearer ${t}`
  }
  const opts = { method, headers }
  if (body) opts.body = JSON.stringify(body)

  const res = await fetch(BASE + path, opts)
  if (res.status === 204) return null

  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    const msg = data.detail || 'Что-то пошло не так'
    throw new Error(Array.isArray(msg) ? msg.map(e => e.msg).join('; ') : String(msg))
  }
  return data
}

export const api = {
  register: d => req('POST', '/auth/register', d),
  login:    d => req('POST', '/auth/login', d),
  me:       () => req('GET',  '/auth/me', null, true),

  getBooks: (params = {}) => {
    const q = new URLSearchParams()
    Object.entries(params).forEach(([k, v]) => { if (v != null && v !== '') q.set(k, v) })
    return req('GET', `/books/?${q}`)
  },
  getBook:    id    => req('GET',    `/books/${id}`),
  createBook: d     => req('POST',   '/books/', d, true),
  updateBook: (id, d) => req('PUT',  `/books/${id}`, d, true),
  deleteBook: id    => req('DELETE', `/books/${id}`, null, true),

  getUser:        id => req('GET', `/users/${id}`),
  getUserBooks:   id => req('GET', `/users/${id}/books`),
  getUserReviews: id => req('GET', `/users/${id}/reviews`),
  updateProfile:  d  => req('PUT', '/users/me', d, true),

  proposeExchange:  d  => req('POST', '/exchanges/', d, true),
  getExchanges:     () => req('GET',  '/exchanges/', null, true),
  acceptExchange:   id => req('PUT',  `/exchanges/${id}/accept`, null, true),
  rejectExchange:   id => req('PUT',  `/exchanges/${id}/reject`, null, true),
  completeExchange: id => req('PUT',  `/exchanges/${id}/complete`, null, true),
  cancelExchange:   id => req('PUT',  `/exchanges/${id}/cancel`, null, true),
  createReview:     d  => req('POST', '/exchanges/reviews', d, true),
}
