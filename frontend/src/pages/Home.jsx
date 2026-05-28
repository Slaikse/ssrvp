import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { api } from '../api'
import BookCard from '../components/BookCard'

const GENRES = [
  { key:'fiction',   icon:'✍️', label:'Художественная' },
  { key:'fantasy',   icon:'🐉', label:'Фэнтези' },
  { key:'detective', icon:'🔍', label:'Детектив' },
  { key:'science',   icon:'🔬', label:'Наука' },
  { key:'history',   icon:'🏛️', label:'История' },
  { key:'biography', icon:'👤', label:'Биография' },
  { key:'romance',   icon:'💕', label:'Романтика' },
  { key:'children',  icon:'🧸', label:'Детская' },
]

export default function Home() {
  const [search, setSearch] = useState('')
  const [books, setBooks] = useState([])
  const [stats, setStats] = useState({ books: 0, users: 0, exchanges: 0 })
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    api.getBooks({ limit: 8, status: 'available' }).then(data => {
      setBooks(data)
      const users = new Set(data.map(b => b.owner_id)).size
      setStats(s => ({ ...s, books: data.length, users }))
    }).finally(() => setLoading(false))

    api.getBooks({ status: 'exchanged', limit: 100 }).then(data => {
      setStats(s => ({ ...s, exchanges: data.length }))
    }).catch(() => {})
  }, [])

  const doSearch = () => {
    if (search.trim()) navigate(`/catalog?search=${encodeURIComponent(search.trim())}`)
    else navigate('/catalog')
  }

  return (
    <>
      {/* ── HERO ── */}
      <section className="hero-c">
        <div className="container" style={{ position:'relative', zIndex:1 }}>
          <div className="row align-items-center">
            <div className="col-lg-7">
              <h1>Обменивайтесь книгами<br />с соседями</h1>
              <p>
                Находите читателей рядом с вами. Отдавайте прочитанное —
                получайте новое. Бесплатно и без посредников.
              </p>
              <div className="search-c">
                <input
                  value={search} onChange={e => setSearch(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && doSearch()}
                  placeholder="Название книги или автор…"
                />
                <button onClick={doSearch}>Найти книгу</button>
              </div>
              <div className="hero-stats-c">
                <div>
                  <div className="stat-num">{stats.books || '—'}</div>
                  <div className="stat-label">книг доступно</div>
                </div>
                <div>
                  <div className="stat-num">{stats.users || '—'}</div>
                  <div className="stat-label">читателей</div>
                </div>
                <div>
                  <div className="stat-num">{stats.exchanges || '0'}</div>
                  <div className="stat-label">обменов совершено</div>
                </div>
              </div>
            </div>
            <div className="col-lg-5 d-none d-lg-flex justify-content-center">
              <div style={{ fontSize:'9rem', opacity:0.12, userSelect:'none', lineHeight:1 }}>📚</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── RECENT BOOKS ── */}
      <section className="section-c">
        <div className="container">
          <div className="d-flex align-items-end justify-content-between mb-1">
            <div>
              <h2 className="section-title">Свежие поступления</h2>
              <p className="section-sub mb-0">Книги, добавленные совсем недавно</p>
            </div>
            <Link to="/catalog" className="btn-outline-c" style={{ marginBottom:'0.25rem' }}>
              Все книги →
            </Link>
          </div>
          <div style={{ height:1, background:'var(--border)', margin:'1.25rem 0 1.75rem' }} />

          {loading ? (
            <div className="loading-c">
              <span className="spinner-c spinner-dark" />
              <span style={{ color:'var(--muted)' }}>Загружаем…</span>
            </div>
          ) : books.length ? (
            <div className="row g-3">
              {books.map(b => (
                <div key={b.id} className="col-6 col-md-4 col-lg-3">
                  <BookCard book={b} />
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-c">
              <span className="empty-icon-c">📭</span>
              <h4>Пока книг нет</h4>
              <p>Станьте первым — добавьте свою книгу</p>
              <Link to="/register" className="btn-primary-c">Начать</Link>
            </div>
          )}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="section-c" style={{ background:'var(--surface)', borderTop:'1px solid var(--border)', borderBottom:'1px solid var(--border)' }}>
        <div className="container">
          <h2 className="section-title text-center mb-1">Как это работает</h2>
          <p className="section-sub text-center">Три шага до новой книги</p>
          <div className="row g-4 text-center">
            {[
              { icon:'📖', step:'1', title:'Добавьте книги', desc:'Разместите книги, которые готовы отдать в обмен' },
              { icon:'🔍', step:'2', title:'Найдите нужное', desc:'Ищите по названию, автору, жанру или городу' },
              { icon:'🤝', step:'3', title:'Обменяйтесь',   desc:'Предложите обмен, договоритесь и встретьтесь' },
            ].map(({ icon, step, title, desc }) => (
              <div key={step} className="col-md-4">
                <div style={{ fontSize:'2.5rem', marginBottom:'0.75rem' }}>{icon}</div>
                <h5>{step}. {title}</h5>
                <p style={{ color:'var(--muted)', fontSize:'0.9rem', margin:0 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── GENRES ── */}
      <section className="section-c">
        <div className="container">
          <h2 className="section-title mb-1">Популярные жанры</h2>
          <p className="section-sub">Выберите категорию и найдите своё</p>
          <div className="row g-3">
            {GENRES.map(g => (
              <div key={g.key} className="col-6 col-sm-4 col-md-3">
                <div
                  onClick={() => navigate(`/catalog?genre=${g.key}`)}
                  style={{
                    background:'var(--surface)', border:'1px solid var(--border)',
                    borderRadius:'var(--r)', padding:'1.1rem', textAlign:'center',
                    cursor:'pointer', transition:'border-color 0.2s, background 0.2s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor='var(--primary)'; e.currentTarget.style.background='var(--primary-bg)' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor='var(--border)'; e.currentTarget.style.background='var(--surface)' }}
                >
                  <div style={{ fontSize:'1.75rem', marginBottom:'0.4rem' }}>{g.icon}</div>
                  <div style={{ fontWeight:600, fontSize:'0.88rem' }}>{g.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
