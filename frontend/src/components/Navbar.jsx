import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { avatarColor, firstLetter } from '../utils'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [open, setOpen] = useState(false)
  const dropRef = useRef(null)

  const active = path => location.pathname === path ? ' active' : ''

  const handleLogout = () => {
    logout()
    navigate('/')
    setOpen(false)
  }

  useEffect(() => {
    const handler = e => {
      if (dropRef.current && !dropRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <nav className="navbar-c">
      <div className="container d-flex align-items-center justify-content-between gap-3">

        <Link to="/" className="navbar-brand-c">
          <span className="nav-icon-c">📚</span>
          BookSwap
        </Link>

        <div className="d-flex align-items-center gap-1 flex-wrap">
          <Link to="/catalog" className={`nav-link-c${active('/catalog')}`}>Каталог</Link>

          {user ? (
            <>
              <Link to="/my-books"  className={`nav-link-c${active('/my-books')}`}>Мои книги</Link>
              <Link to="/exchanges" className={`nav-link-c${active('/exchanges')}`}>Обмены</Link>

              <div style={{ position: 'relative' }} ref={dropRef}>
                <button
                  className="btn-reset d-flex align-items-center gap-2"
                  style={{
                    padding: '0.35rem 0.6rem', borderRadius: 8,
                    background: open ? 'var(--primary-bg)' : 'transparent',
                    transition: 'background 0.2s',
                  }}
                  onClick={() => setOpen(v => !v)}
                >
                  <span className="avatar-c" style={{ background: avatarColor(user.username) }}>
                    {firstLetter(user.username)}
                  </span>
                  <span style={{ fontSize: '0.87rem', fontWeight: 500 }}>{user.username}</span>
                  <span style={{ fontSize: '0.6rem', color: 'var(--muted)', marginLeft: 2 }}>▼</span>
                </button>

                {open && (
                  <div className="dropdown-menu-c">
                    <Link to="/profile" className="dropdown-item-c" onClick={() => setOpen(false)}>
                      Профиль
                    </Link>
                    <button className="dropdown-item-c danger btn-reset w-100 text-start" onClick={handleLogout}>
                      Выйти
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/login"    className={`nav-link-c nav-btn-login${active('/login')}`}>Войти</Link>
              <Link to="/register" className="nav-link-c nav-btn-register">Регистрация</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
