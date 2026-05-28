import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { coverGradient, firstLetter, CONDITION_LABELS, STATUS_LABELS, formatDate } from '../utils'

export default function Exchanges() {
  const { user } = useAuth()
  const toast = useToast()

  const [tab, setTab]         = useState('incoming')
  const [exchanges, setExchanges] = useState([])
  const [loading, setLoading] = useState(true)
  const [actionId, setActionId] = useState(null)

  // reviewModal: { exchangeId, bookTitle, reviewedId }
  const [reviewModal, setReviewModal] = useState(null)
  const [rating, setRating]   = useState(5)
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const load = () => {
    setLoading(true)
    api.getExchanges().then(setExchanges).catch(() => setExchanges([])).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  // "owner" = book_wanted.owner, "proposer" = person who requested
  const incoming  = exchanges.filter(e => e.book_wanted?.owner_id === user.id && e.status === 'pending')
  const accepted  = exchanges.filter(e => e.book_wanted?.owner_id === user.id && e.status === 'accepted')
  const outgoing  = exchanges.filter(e => e.proposer_id === user.id && (e.status === 'pending' || e.status === 'accepted'))
  const completed = exchanges.filter(e =>
    (e.book_wanted?.owner_id === user.id || e.proposer_id === user.id) &&
    (e.status === 'completed' || e.status === 'rejected' || e.status === 'cancelled')
  )

  const tabs = [
    { key: 'incoming',  label: 'Входящие',    count: incoming.length + accepted.length },
    { key: 'outgoing',  label: 'Исходящие',   count: outgoing.length },
    { key: 'completed', label: 'Завершённые', count: completed.length },
  ]

  const currentList = tab === 'incoming' ? [...accepted, ...incoming]
                    : tab === 'outgoing'  ? outgoing
                    : completed

  const act = async (fn, id) => {
    setActionId(id)
    try { await fn(id); load() }
    catch (e) { toast(e.message, 'error') }
    finally { setActionId(null) }
  }

  const openReview = ex => {
    const isProposer = ex.proposer_id === user.id
    const reviewedId = isProposer ? ex.book_wanted?.owner_id : ex.proposer_id
    setReviewModal({ exchangeId: ex.id, bookTitle: ex.book_wanted?.title, reviewedId })
    setRating(5); setComment('')
  }

  const submitReview = async () => {
    setSubmitting(true)
    try {
      await api.createReview({ exchange_id: reviewModal.exchangeId, reviewed_id: reviewModal.reviewedId, rating, comment })
      toast('Отзыв оставлен!', 'success')
      setReviewModal(null)
      load()
    } catch (e) { toast(e.message, 'error') }
    finally { setSubmitting(false) }
  }

  return (
    <div className="container" style={{ padding: '2rem 0 4rem' }}>
      <div className="page-header-c">
        <h1>Мои обмены</h1>
        <p style={{ color: 'var(--muted)', margin: 0 }}>Управляйте запросами на обмен</p>
      </div>

      <div className="tabs-c">
        {tabs.map(t => (
          <button key={t.key} className={`tab-c${tab === t.key ? ' active' : ''}`} onClick={() => setTab(t.key)}>
            {t.label}
            {t.count > 0 && <span className="tab-count-c">{t.count}</span>}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="loading-c"><span className="spinner-c spinner-dark" /></div>
      ) : currentList.length ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {currentList.map(ex => (
            <ExchangeCard
              key={ex.id}
              ex={ex}
              userId={user.id}
              actionId={actionId}
              onAccept={id => act(api.acceptExchange, id)}
              onReject={id => act(api.rejectExchange, id)}
              onComplete={id => act(api.completeExchange, id)}
              onCancel={id => act(api.cancelExchange, id)}
              onReview={openReview}
            />
          ))}
        </div>
      ) : (
        <div className="empty-c">
          <span className="empty-icon-c">
            {tab === 'incoming' ? '📬' : tab === 'outgoing' ? '📤' : '✅'}
          </span>
          <h4>
            {tab === 'incoming' ? 'Нет входящих запросов'
           : tab === 'outgoing' ? 'Вы не отправляли запросов'
           : 'Нет завершённых обменов'}
          </h4>
          <p style={{ margin: '0.5rem 0 1.5rem' }}>
            {tab === 'incoming' ? 'Когда кто-то захочет вашу книгу — запрос появится здесь'
           : tab === 'outgoing' ? 'Найдите интересную книгу и предложите обмен'
           : 'Завершённые и отклонённые обмены появятся здесь'}
          </p>
          {tab === 'outgoing' && <Link to="/catalog" className="btn-primary-c">Перейти в каталог</Link>}
        </div>
      )}

      {reviewModal && (
        <div className="modal-overlay-c" onClick={e => e.target === e.currentTarget && setReviewModal(null)}>
          <div className="modal-box-c" style={{ maxWidth: 440, textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⭐</div>
            <h4 style={{ marginBottom: '0.25rem' }}>Оставить отзыв</h4>
            <p style={{ color: 'var(--muted)', fontSize: '0.87rem', marginBottom: '1.25rem' }}>
              Книга: <b>{reviewModal.bookTitle}</b>
            </p>
            <StarPicker value={rating} onChange={setRating} />
            <textarea
              className="form-control-c" rows={3}
              placeholder="Комментарий (необязательно)…"
              value={comment} onChange={e => setComment(e.target.value)}
              style={{ marginTop: '1rem', textAlign: 'left' }}
            />
            <div className="d-flex gap-2 justify-content-end mt-3">
              <button className="btn-ghost-c" onClick={() => setReviewModal(null)}>Отмена</button>
              <button className="btn-primary-c" onClick={submitReview} disabled={submitting}>
                {submitting ? <><span className="spinner-c" /> Отправляем…</> : 'Отправить'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function ExchangeCard({ ex, userId, actionId, onAccept, onReject, onComplete, onCancel, onReview }) {
  const isOwner = ex.book_wanted?.owner_id === userId  // owner of the wanted book
  const busy    = actionId === ex.id
  const hasReview = !!ex.review

  const statusColor = {
    pending:   '#f59e0b',
    accepted:  'var(--primary)',
    completed: '#16a34a',
    rejected:  'var(--danger)',
    cancelled: 'var(--muted)',
  }

  const otherParty = isOwner
    ? (ex.proposer?.full_name || ex.proposer?.username)
    : (ex.book_wanted?.owner?.full_name || ex.book_wanted?.owner?.username)

  return (
    <div className="card-c" style={{ padding: '1.25rem' }}>
      <div className="d-flex align-items-start justify-content-between flex-wrap gap-3">
        <div className="d-flex gap-3 flex-wrap align-items-center flex-fill">
          <MiniBook book={ex.book_wanted} label="Хочет" />
          {ex.book_offered && (
            <>
              <div style={{ fontSize: '1.25rem', color: 'var(--muted)', alignSelf: 'center' }}>⇄</div>
              <MiniBook book={ex.book_offered} label="Предлагает" />
            </>
          )}
        </div>
        <span style={{
          fontSize: '0.75rem', fontWeight: 600, padding: '0.25rem 0.65rem',
          borderRadius: 99, background: (statusColor[ex.status] || 'var(--muted)') + '20',
          color: statusColor[ex.status] || 'var(--muted)', whiteSpace: 'nowrap',
        }}>
          {STATUS_LABELS[ex.status] || ex.status}
        </span>
      </div>

      <div style={{ marginTop: '0.75rem', fontSize: '0.83rem', color: 'var(--muted)' }}>
        {isOwner
          ? <>Запрос от: <b style={{ color: 'var(--text)' }}>{otherParty}</b></>
          : <>Владелец: <b style={{ color: 'var(--text)' }}>{otherParty}</b></>
        }
        {' · '}{formatDate(ex.created_at)}
        {ex.message && (
          <div style={{ marginTop: '0.4rem', fontStyle: 'italic' }}>"{ex.message}"</div>
        )}
      </div>

      <div className="d-flex gap-2 flex-wrap mt-3 pt-2" style={{ borderTop: '1px solid var(--border)' }}>
        {ex.status === 'pending' && isOwner && (
          <>
            <button className="btn-primary-c" style={{ fontSize: '0.82rem', padding: '0.3rem 0.9rem' }}
              onClick={() => onAccept(ex.id)} disabled={busy}>
              {busy ? '…' : '✓ Принять'}
            </button>
            <button className="btn-ghost-c" style={{ fontSize: '0.82rem', padding: '0.3rem 0.9rem', color: 'var(--danger)' }}
              onClick={() => onReject(ex.id)} disabled={busy}>
              {busy ? '…' : '✗ Отклонить'}
            </button>
          </>
        )}
        {ex.status === 'accepted' && isOwner && (
          <button className="btn-primary-c" style={{ fontSize: '0.82rem', padding: '0.3rem 0.9rem' }}
            onClick={() => onComplete(ex.id)} disabled={busy}>
            {busy ? '…' : '🤝 Завершить обмен'}
          </button>
        )}
        {(ex.status === 'pending' || ex.status === 'accepted') && !isOwner && (
          <button className="btn-ghost-c" style={{ fontSize: '0.82rem', padding: '0.3rem 0.9rem', color: 'var(--danger)' }}
            onClick={() => onCancel(ex.id)} disabled={busy}>
            {busy ? '…' : '✗ Отменить'}
          </button>
        )}
        {ex.status === 'completed' && !hasReview && (
          <button className="btn-outline-c" style={{ fontSize: '0.82rem', padding: '0.3rem 0.9rem' }}
            onClick={() => onReview(ex)}>
            ⭐ Оставить отзыв
          </button>
        )}
        {ex.status === 'completed' && hasReview && (
          <span style={{ fontSize: '0.82rem', color: 'var(--success)', alignSelf: 'center' }}>✓ Отзыв оставлен</span>
        )}
      </div>
    </div>
  )
}

function MiniBook({ book, label }) {
  if (!book) return null
  return (
    <div className="d-flex gap-2 align-items-center">
      <Link to={`/books/${book.id}`} style={{ textDecoration: 'none', flexShrink: 0 }}>
        <div style={{
          width: 44, height: 60, borderRadius: 6,
          background: coverGradient(book.title),
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <span style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.3rem', fontWeight: 700, color: 'rgba(255,255,255,0.85)' }}>
            {firstLetter(book.title)}
          </span>
        </div>
      </Link>
      <div>
        <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--muted)', fontWeight: 600 }}>
          {label}
        </div>
        <Link to={`/books/${book.id}`} style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--text)', textDecoration: 'none' }}>
          {book.title}
        </Link>
        <div style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>{book.author}</div>
        {book.condition && (
          <span style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>{CONDITION_LABELS[book.condition]}</span>
        )}
      </div>
    </div>
  )
}

function StarPicker({ value, onChange }) {
  const [hover, setHover] = useState(0)
  return (
    <div style={{ display: 'flex', justifyContent: 'center', gap: '0.3rem' }}>
      {[1, 2, 3, 4, 5].map(n => (
        <span
          key={n}
          onClick={() => onChange(n)}
          onMouseEnter={() => setHover(n)}
          onMouseLeave={() => setHover(0)}
          style={{
            fontSize: '2rem', cursor: 'pointer', transition: 'transform 0.1s',
            color: n <= (hover || value) ? '#f59e0b' : 'var(--border)',
            transform: n <= (hover || value) ? 'scale(1.15)' : 'scale(1)',
            userSelect: 'none',
          }}
        >★</span>
      ))}
    </div>
  )
}
