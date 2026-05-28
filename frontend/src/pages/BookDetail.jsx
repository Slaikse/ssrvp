import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { api } from '../api'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { coverGradient, avatarColor, firstLetter, GENRE_LABELS, CONDITION_LABELS, STATUS_LABELS, formatDate, starsHtml } from '../utils'

export default function BookDetail() {
  const { id } = useParams()
  const { user } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()

  const [book, setBook]       = useState(null)
  const [loading, setLoading] = useState(true)
  const [modal, setModal]     = useState(false)
  const [myBooks, setMyBooks] = useState([])
  const [offeredId, setOfferedId] = useState('')
  const [message, setMessage]    = useState('')
  const [sending, setSending]    = useState(false)

  useEffect(() => {
    api.getBook(id).then(setBook).catch(() => setBook(null)).finally(() => setLoading(false))
  }, [id])

  const openModal = async () => {
    if (!user) { navigate('/login'); return }
    setModal(true)
    if (!myBooks.length) {
      try {
        const books = await api.getUserBooks(user.id)
        setMyBooks(books.filter(b => b.status === 'available'))
      } catch {}
    }
  }

  const propose = async () => {
    setSending(true)
    try {
      await api.proposeExchange({
        book_wanted_id: parseInt(id),
        book_offered_id: offeredId ? parseInt(offeredId) : null,
        message,
      })
      setModal(false)
      toast('Запрос на обмен отправлен!', 'success')
      navigate('/exchanges')
    } catch (e) {
      toast(e.message, 'error')
    } finally {
      setSending(false)
    }
  }

  if (loading) return <div className="loading-c"><span className="spinner-c spinner-dark" /></div>

  if (!book) return (
    <div className="container">
      <div className="empty-c">
        <span className="empty-icon-c">❌</span>
        <h4>Книга не найдена</h4>
        <Link to="/catalog" className="btn-primary-c">В каталог</Link>
      </div>
    </div>
  )

  const isOwner   = user?.id === book.owner_id
  const canExchange = user && !isOwner && book.status === 'available'
  const ownerColor = avatarColor(book.owner.username)
  const ownerName  = book.owner.full_name || book.owner.username

  return (
    <>
      <div className="container" style={{ padding:'2rem 0 4rem' }}>
        {/* Breadcrumb */}
        <nav style={{ fontSize:'0.84rem', color:'var(--muted)', marginBottom:'1.5rem' }}>
          <Link to="/" style={{ color:'var(--muted)' }}>Главная</Link>
          {' / '}
          <Link to="/catalog" style={{ color:'var(--muted)' }}>Каталог</Link>
          {' / '}
          <span>{book.title}</span>
        </nav>

        <div className="row g-4">
          {/* Cover */}
          <div className="col-md-4 col-lg-3">
            <div style={{
              height: 280, borderRadius:'var(--r)', display:'flex', alignItems:'center',
              justifyContent:'center', position:'relative', overflow:'hidden',
              background: coverGradient(book.title),
            }}>
              <div style={{ position:'absolute', left:0, top:0, bottom:0, width:14, background:'rgba(0,0,0,0.18)' }} />
              <span style={{ fontFamily:"'Playfair Display',serif", fontSize:'5.5rem', fontWeight:700, color:'rgba(255,255,255,0.78)', textShadow:'0 4px 16px rgba(0,0,0,0.2)' }}>
                {firstLetter(book.title)}
              </span>
            </div>
          </div>

          {/* Info */}
          <div className="col-md-8 col-lg-9">
            <h1 style={{ fontSize:'2rem', marginBottom:'0.2rem' }}>{book.title}</h1>
            <p style={{ color:'var(--muted)', fontSize:'1rem', fontStyle:'italic', marginBottom:'1rem' }}>{book.author}</p>

            <div className="d-flex gap-2 flex-wrap mb-3">
              <span className="badge-c badge-genre-c">{GENRE_LABELS[book.genre] || book.genre}</span>
              <span className={`badge-c badge-${book.condition}`}>{CONDITION_LABELS[book.condition]}</span>
              <span className={`badge-c badge-${book.status}`}>{STATUS_LABELS[book.status]}</span>
            </div>

            <div className="card-c mb-3" style={{ padding:'1rem' }}>
              <div className="info-row-c"><span className="info-label-c">Жанр</span>     <span className="info-value-c">{GENRE_LABELS[book.genre]}</span></div>
              <div className="info-row-c"><span className="info-label-c">Состояние</span><span className="info-value-c">{CONDITION_LABELS[book.condition]}</span></div>
              <div className="info-row-c"><span className="info-label-c">Статус</span>   <span className="info-value-c">{STATUS_LABELS[book.status]}</span></div>
              <div className="info-row-c"><span className="info-label-c">Добавлена</span><span className="info-value-c">{formatDate(book.created_at)}</span></div>
              {book.description && (
                <div className="info-row-c" style={{ flexDirection:'column', gap:'0.35rem' }}>
                  <span className="info-label-c">Описание</span>
                  <span style={{ color:'var(--muted)', fontWeight:400, fontSize:'0.9rem' }}>{book.description}</span>
                </div>
              )}
            </div>

            {/* Owner */}
            <div className="card-c mb-3" style={{ padding:'1rem' }}>
              <p style={{ fontSize:'0.75rem', textTransform:'uppercase', letterSpacing:'0.05em', color:'var(--muted)', marginBottom:'0.75rem', fontWeight:600 }}>
                Владелец
              </p>
              <div className="d-flex align-items-center gap-3">
                <span className="avatar-c lg" style={{ background: ownerColor }}>
                  {firstLetter(book.owner.username)}
                </span>
                <div>
                  <div style={{ fontWeight:600 }}>{ownerName}</div>
                  <div style={{ fontSize:'0.84rem', color:'var(--muted)' }}>
                    {book.owner.city && `📍 ${book.owner.city} · `}
                    {book.owner.rating > 0
                      ? <span className="stars-c">{starsHtml(book.owner.rating)}</span>
                      : 'Нет отзывов'}
                    {book.owner.rating > 0 && ` ${book.owner.rating.toFixed(1)}`}
                  </div>
                </div>
                <Link to={`/profile/${book.owner.id}`} className="btn-ghost-c ms-auto">
                  Профиль
                </Link>
              </div>
            </div>

            {/* Actions */}
            <div className="d-flex gap-2 flex-wrap">
              {canExchange && (
                <button className="btn-primary-c" onClick={openModal}>🤝 Предложить обмен</button>
              )}
              {isOwner && (
                <Link to="/my-books" className="btn-outline-c">✏️ Редактировать</Link>
              )}
              {!user && (
                <Link to="/login" className="btn-primary-c">Войдите для обмена</Link>
              )}
              {user && !isOwner && book.status !== 'available' && (
                <p style={{ color:'var(--muted)', fontSize:'0.9rem', margin:0, alignSelf:'center' }}>
                  Книга сейчас недоступна для обмена
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* EXCHANGE MODAL */}
      {modal && (
        <div className="modal-overlay-c" onClick={e => e.target === e.currentTarget && setModal(false)}>
          <div className="modal-box-c">
            <h4 style={{ marginBottom:'0.25rem' }}>Предложить обмен</h4>
            <p style={{ color:'var(--muted)', fontSize:'0.87rem', marginBottom:'1.25rem' }}>
              Выберите книгу для обмена и напишите сообщение
            </p>

            <div style={{ marginBottom:'1rem' }}>
              <label className="form-label-c">Ваша книга взамен (необязательно)</label>
              <select className="form-select-c" value={offeredId} onChange={e => setOfferedId(e.target.value)}>
                <option value="">— Без предложения —</option>
                {myBooks.map(b => (
                  <option key={b.id} value={b.id}>{b.title} — {b.author}</option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom:'1.25rem' }}>
              <label className="form-label-c">Сообщение владельцу</label>
              <textarea className="form-control-c" rows={3}
                placeholder="Напишите что-нибудь…" value={message}
                onChange={e => setMessage(e.target.value)} />
            </div>

            <div className="d-flex gap-2 justify-content-end">
              <button className="btn-ghost-c" onClick={() => setModal(false)}>Отмена</button>
              <button className="btn-primary-c" onClick={propose} disabled={sending}>
                {sending ? <><span className="spinner-c" /> Отправляем…</> : 'Отправить запрос'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
