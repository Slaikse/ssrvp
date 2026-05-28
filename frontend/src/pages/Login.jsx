import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../api'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'

export default function Login() {
  const { login } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPwd, setShowPwd] = useState(false)

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  const submit = async e => {
    e.preventDefault()
    setError('')
    if (!form.email || !form.password) { setError('Заполните все поля'); return }
    setLoading(true)
    try {
      const data = await api.login(form)
      login(data.access_token, data.user)
      toast(`Добро пожаловать, ${data.user.username}!`, 'success')
      navigate('/')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'calc(100vh - 130px)', padding:'2rem 1rem', background:'var(--bg)' }}>
      <div className="card-c" style={{ width:'100%', maxWidth:440 }}>
        <h2 style={{ marginBottom:'0.25rem' }}>Добро пожаловать</h2>
        <p style={{ color:'var(--muted)', fontSize:'0.9rem', marginBottom:'1.75rem' }}>
          Войдите, чтобы обмениваться книгами
        </p>

        <form onSubmit={submit} noValidate>
          <div className="mb-3">
            <label className="form-label-c">Email</label>
            <input className="form-control-c" type="email" placeholder="your@email.com"
              value={form.email} onChange={set('email')} autoComplete="email" />
          </div>

          <div className="mb-4">
            <label className="form-label-c">Пароль</label>
            <div style={{ position:'relative' }}>
              <input className="form-control-c" type={showPwd ? 'text' : 'password'}
                placeholder="••••••••" value={form.password} onChange={set('password')}
                autoComplete="current-password" style={{ paddingRight:'3rem' }} />
              <button type="button" onClick={() => setShowPwd(v => !v)}
                style={{ position:'absolute', right:'0.75rem', top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:'var(--muted)', fontSize:'1rem' }}>
                {showPwd ? '🙈' : '👁'}
              </button>
            </div>
          </div>

          {error && <p style={{ color:'var(--danger)', fontSize:'0.87rem', marginBottom:'1rem' }}>{error}</p>}

          <button type="submit" className="btn-primary-c w-100 justify-content-center" disabled={loading}>
            {loading ? <><span className="spinner-c" /> Входим…</> : 'Войти'}
          </button>
        </form>

        <p style={{ textAlign:'center', marginTop:'1.25rem', fontSize:'0.87rem', color:'var(--muted)' }}>
          Нет аккаунта?{' '}
          <Link to="/register" style={{ fontWeight:600 }}>Зарегистрируйтесь</Link>
        </p>
      </div>
    </div>
  )
}
