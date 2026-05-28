import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="footer-c">
      <div className="container">
        <div className="row g-4">
          <div className="col-md-4">
            <div className="footer-brand-c">📚 BookSwap</div>
            <p style={{ marginTop: '0.4rem' }}>
              Сервис обмена книгами. Давай им вторую жизнь — бесплатно и без посредников.
            </p>
          </div>
          <div className="col-md-2">
            <p style={{ color: 'white', fontWeight: 600, marginBottom: '0.5rem' }}>Навигация</p>
            <p style={{ marginBottom: '0.3rem' }}><Link to="/catalog">Каталог</Link></p>
            <p style={{ marginBottom: '0.3rem' }}><Link to="/register">Регистрация</Link></p>
            <p style={{ marginBottom: '0.3rem' }}>
              <a href="/api/docs" target="_blank" rel="noreferrer">API Docs</a>
            </p>
          </div>
        </div>
        <hr style={{ borderColor: 'rgba(255,255,255,0.1)', margin: '1.25rem 0 1rem' }} />
        <p style={{ textAlign: 'center', fontSize: '0.79rem' }}>
          © 2025 BookSwap. Учебный проект.
        </p>
      </div>
    </footer>
  )
}
