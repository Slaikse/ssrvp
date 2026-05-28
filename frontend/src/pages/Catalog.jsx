import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { api } from '../api'
import { useAuth } from '../context/AuthContext'
import BookCard from '../components/BookCard'
import { GENRE_LABELS, CONDITION_LABELS } from '../utils'

const GENRES     = ['all','fiction','fantasy','detective','science','history','biography','romance','children','nonfiction','other']
const CONDITIONS = ['all','new','good','fair','poor']
const LIMIT = 12

export default function Catalog() {
  const [params, setParams] = useSearchParams()
  const { user } = useAuth()
  const navigate = useNavigate()

  const [books, setBooks]       = useState([])
  const [loading, setLoading]   = useState(true)
  const [page, setPage]         = useState(0)
  const [hasMore, setHasMore]   = useState(false)
  const [total, setTotal]       = useState(null)

  const [search,    setSearch]    = useState(params.get('search') || '')
  const [genre,     setGenre]     = useState(params.get('genre')  || 'all')
  const [condition, setCondition] = useState('all')
  const [city,      setCity]      = useState('')

  useEffect(() => { load(0) }, [])

  async function load(pg) {
    setLoading(true)
    const p = { limit: LIMIT, skip: pg * LIMIT, status: 'available' }
    if (search.trim())       p.search    = search.trim()
    if (genre !== 'all')     p.genre     = genre
    if (condition !== 'all') p.condition = condition
    if (city.trim())         p.city      = city.trim()
    try {
      const data = await api.getBooks(p)
      setBooks(data)
      setPage(pg)
      setHasMore(data.length === LIMIT)
      setTotal(pg === 0 ? data.length : null)
    } finally {
      setLoading(false)
    }
  }

  const apply = () => load(0)
  const reset = () => {
    setSearch(''); setGenre('all'); setCondition('all'); setCity('')
    setTimeout(() => load(0), 0)
  }

  const GenreList = () => GENRES.map(g => (
    <div key={g} className={`filter-opt-c${genre === g ? ' active' : ''}`} onClick={() => setGenre(g)}>
      {g === 'all' ? 'Все жанры' : GENRE_LABELS[g] || g}
    </div>
  ))
  const CondList = () => CONDITIONS.map(c => (
    <div key={c} className={`filter-opt-c${condition === c ? ' active' : ''}`} onClick={() => setCondition(c)}>
      {c === 'all' ? 'Любое' : CONDITION_LABELS[c] || c}
    </div>
  ))

  return (
    <div className="container" style={{ padding:'2rem 0 4rem' }}>
      <div className="row g-4">

        {/* SIDEBAR */}
        <div className="col-lg-3">
          <div className="filter-sidebar-c">
            <div style={{ marginBottom:'1rem' }}>
              <input className="form-control-c" placeholder="🔍 Поиск…" value={search}
                onChange={e => setSearch(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && apply()} />
            </div>

            <div className="filter-label-c">Жанр</div>
            <GenreList />

            <div className="filter-label-c">Состояние</div>
            <CondList />

            <div className="filter-label-c">Город</div>
            <input className="form-control-c" style={{ marginTop:4, fontSize:'0.85rem' }}
              placeholder="Например: Москва" value={city}
              onChange={e => setCity(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && apply()} />

            <button className="btn-primary-c w-100 justify-content-center mt-3" onClick={apply}>
              Применить
            </button>
            <button className="btn-ghost-c w-100 justify-content-center mt-1" onClick={reset}>
              Сбросить
            </button>
          </div>
        </div>

        {/* MAIN */}
        <div className="col-lg-9">
          <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-3">
            <div>
              <h1 style={{ fontSize:'1.5rem', marginBottom:'0.1rem' }}>Каталог книг</h1>
              <p style={{ color:'var(--muted)', fontSize:'0.84rem', margin:0 }}>
                {loading ? 'Загружаем…' : books.length
                  ? `Найдено: ${books.length}${hasMore ? '+' : ''} книг`
                  : 'Ничего не найдено'}
              </p>
            </div>
            {user && (
              <button className="btn-primary-c" onClick={() => navigate('/my-books')}>
                + Добавить книгу
              </button>
            )}
          </div>

          {loading ? (
            <div className="loading-c">
              <span className="spinner-c spinner-dark" />
            </div>
          ) : books.length ? (
            <div className="row g-3">
              {books.map(b => (
                <div key={b.id} className="col-6 col-md-4">
                  <BookCard book={b} />
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-c">
              <span className="empty-icon-c">📭</span>
              <h4>Книги не найдены</h4>
              <p>Попробуйте изменить фильтры или поисковый запрос</p>
              <button className="btn-outline-c" onClick={reset}>Сбросить фильтры</button>
            </div>
          )}

          {(page > 0 || hasMore) && !loading && (
            <div className="d-flex justify-content-center gap-2 mt-4">
              {page > 0 && (
                <button className="btn-outline-c" onClick={() => { load(page - 1); window.scrollTo(0,0) }}>
                  ← Назад
                </button>
              )}
              {hasMore && (
                <button className="btn-primary-c" onClick={() => { load(page + 1); window.scrollTo(0,0) }}>
                  Далее →
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
