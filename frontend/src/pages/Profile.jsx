import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { api } from '../api'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { coverGradient, avatarColor, firstLetter, GENRE_LABELS, CONDITION_LABELS, STATUS_LABELS, formatDate, starsHtml } from '../utils'

export default function Profile() {
  const { id } = useParams()
  const { user, updateUser } = useAuth()
  const toast = useToast()

  const profileId = id ? parseInt(id) : user?.id
  const isOwn = profileId === user?.id

  const [profile, setProfile] = useState(null)
  const [books, setBooks]     = useState([])
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab]         = useState('books')

  const [editModal, setEditModal] = useState(false)
  const [form, setForm] = useState({ full_name: '', city: '', bio: '' })
  const [saving, setSaving] = useState(false)

  const load = async () => {
    setLoading(true)
    try {
      const [p, b, r] = await Promise.all([
        api.getUser(profileId),
        api.getUserBooks(profileId),
        api.getUserReviews(profileId),
      ])
      setProfile(p)
      setBooks(b)
      setReviews(r)
    } catch {
      setProfile(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [profileId])

  const openEdit = () => {
    setForm({ full_name: profile.full_name || '', city: profile.city || '', bio: profile.bio || '' })
    setEditModal(true)
  }

  const saveProfile = async () => {
    setSaving(true)
    try {
      const updated = await api.updateProfile(form)
      setProfile(p => ({ ...p, ...updated }))
      updateUser(updated)
      setEditModal(false)
      toast('Профиль обновлён', 'success')
    } catch (e) {
      toast(e.message, 'error')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="loading-c"><span className="spinner-c spinner-dark" /></div>

  if (!profile) return (
    <div className="container">
      <div className="empty-c">
        <span className="empty-icon-c">❌</span>
        <h4>Пользователь не найден</h4>
        <Link to="/" className="btn-primary-c">На главную</Link>
      </div>
    </div>
  )

  const color    = avatarColor(profile.username)
  const name     = profile.full_name || profile.username
  const availB   = books.filter(b => b.status === 'available').length

  return (
    <>
      <div className="container" style={{ padding: '2rem 0 4rem' }}>

        {/* Profile header */}
        <div className="card-c" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
          <div className="d-flex gap-4 align-items-start flex-wrap">
            <span className="avatar-c" style={{ background: color, width: 80, height: 80, fontSize: '2rem', flexShrink: 0 }}>
              {firstLetter(profile.username)}
            </span>
            <div className="flex-fill">
              <div className="d-flex align-items-center gap-3 flex-wrap">
                <h2 style={{ margin: 0 }}>{name}</h2>
                {isOwn && (
                  <button className="btn-ghost-c" style={{ fontSize: '0.82rem', padding: '0.3rem 0.75rem' }} onClick={openEdit}>
                    ✏️ Редактировать
                  </button>
                )}
              </div>
              <div style={{ color: 'var(--muted)', fontSize: '0.88rem', marginTop: '0.3rem' }}>@{profile.username}</div>

              <div className="d-flex gap-4 flex-wrap mt-3">
                {profile.city && (
                  <div style={{ fontSize: '0.87rem' }}><span style={{ color: 'var(--muted)' }}>📍</span> {profile.city}</div>
                )}
                <div style={{ fontSize: '0.87rem' }}>
                  <span style={{ color: 'var(--muted)' }}>📚</span> {availB} книг доступно
                </div>
                {profile.rating > 0 && (
                  <div style={{ fontSize: '0.87rem' }} className="d-flex align-items-center gap-1">
                    <span className="stars-c" dangerouslySetInnerHTML={{ __html: starsHtml(profile.rating) }} />
                    <span><b>{profile.rating.toFixed(1)}</b> ({profile.reviews_count} отзывов)</span>
                  </div>
                )}
                <div style={{ fontSize: '0.87rem', color: 'var(--muted)' }}>
                  На сервисе с {formatDate(profile.created_at)}
                </div>
              </div>

              {profile.bio && (
                <p style={{ marginTop: '0.75rem', color: 'var(--muted)', fontSize: '0.9rem', marginBottom: 0 }}>
                  {profile.bio}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="tabs-c" style={{ marginBottom: '1.5rem' }}>
          <button className={`tab-c${tab === 'books' ? ' active' : ''}`} onClick={() => setTab('books')}>
            Книги <span className="tab-count-c">{books.length}</span>
          </button>
          <button className={`tab-c${tab === 'reviews' ? ' active' : ''}`} onClick={() => setTab('reviews')}>
            Отзывы <span className="tab-count-c">{reviews.length}</span>
          </button>
        </div>

        {tab === 'books' && (
          books.length ? (
            <div className="row g-3">
              {books.map(b => (
                <div key={b.id} className="col-6 col-md-4 col-lg-3">
                  <Link to={`/books/${b.id}`} style={{ textDecoration: 'none' }}>
                    <div className="book-card-c">
                      <div className="book-cover-c" style={{ background: coverGradient(b.title) }}>
                        <span className="book-letter-c">{firstLetter(b.title)}</span>
                      </div>
                      <div className="book-body-c">
                        <div className="book-title-c">{b.title}</div>
                        <div className="book-author-c">{b.author}</div>
                        <div className="book-meta-c">
                          <span className="badge-c badge-genre-c">{GENRE_LABELS[b.genre]}</span>
                          <span className={`badge-c badge-${b.condition}`}>{CONDITION_LABELS[b.condition]}</span>
                        </div>
                        <div style={{ marginTop: '0.3rem' }}>
                          <span className={`badge-c badge-${b.status}`}>{STATUS_LABELS[b.status]}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-c">
              <span className="empty-icon-c">📚</span>
              <h4>{isOwn ? 'У вас нет книг' : 'Нет книг'}</h4>
              {isOwn && <Link to="/my-books" className="btn-primary-c">+ Добавить книгу</Link>}
            </div>
          )
        )}

        {tab === 'reviews' && (
          reviews.length ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {reviews.map(r => (
                <div key={r.id} className="card-c" style={{ padding: '1.1rem' }}>
                  <div className="d-flex align-items-start gap-3">
                    <span className="avatar-c" style={{ background: avatarColor(r.reviewer?.username || '?'), flexShrink: 0 }}>
                      {firstLetter(r.reviewer?.username || '?')}
                    </span>
                    <div className="flex-fill">
                      <div className="d-flex align-items-center gap-2 flex-wrap">
                        <b>{r.reviewer?.full_name || r.reviewer?.username}</b>
                        <span className="stars-c" dangerouslySetInnerHTML={{ __html: starsHtml(r.rating) }} />
                        <span style={{ fontWeight: 700 }}>{r.rating}.0</span>
                        <span style={{ color: 'var(--muted)', fontSize: '0.82rem', marginLeft: 'auto' }}>{formatDate(r.created_at)}</span>
                      </div>
                      {r.comment && (
                        <p style={{ margin: '0.5rem 0 0', color: 'var(--muted)', fontSize: '0.9rem' }}>{r.comment}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-c">
              <span className="empty-icon-c">💬</span>
              <h4>Пока нет отзывов</h4>
              <p>Отзывы появятся после завершённых обменов</p>
            </div>
          )
        )}
      </div>

      {/* Edit modal */}
      {editModal && (
        <div className="modal-overlay-c" onClick={e => e.target === e.currentTarget && setEditModal(false)}>
          <div className="modal-box-c" style={{ maxWidth: 480 }}>
            <h4 style={{ marginBottom: '1.5rem' }}>Редактировать профиль</h4>
            <div className="row g-3">
              <div className="col-12">
                <label className="form-label-c">Полное имя</label>
                <input className="form-control-c" placeholder="Иван Петров"
                  value={form.full_name} onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))} />
              </div>
              <div className="col-12">
                <label className="form-label-c">Город</label>
                <input className="form-control-c" placeholder="Москва"
                  value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} />
              </div>
              <div className="col-12">
                <label className="form-label-c">О себе</label>
                <textarea className="form-control-c" rows={3} placeholder="Расскажите о себе…"
                  value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))} />
              </div>
            </div>
            <div className="d-flex gap-2 justify-content-end mt-3">
              <button className="btn-ghost-c" onClick={() => setEditModal(false)}>Отмена</button>
              <button className="btn-primary-c" onClick={saveProfile} disabled={saving}>
                {saving ? <><span className="spinner-c" /> Сохраняем…</> : 'Сохранить'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
