import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../api'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'

export default function Register() {
  const { login } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email:'', username:'', password:'', password2:'', full_name:'', city:'' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  const submit = async e => {
    e.preventDefault()
    setError('')
    if (!form.email || !form.username || !form.password) { setError('Заполните обязательные поля'); return }
    if (form.password !== form.password2) { setError('Пароли не совпадают'); return }
    if (form.password.length < 6) { setError('Пароль должен быть не менее 6 символов'); return }
    setLoading(true)
    try {
      const data = await api.register({ email:form.email, username:form.username, password:form.password, full_name:form.full_name, city:form.city })
      login(data.access_token, data.user)
      toast('Аккаунт создан!', 'success')
      navigate('/')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const Field = ({ label, id, ...props }) => (
    <div>
      <label className="form-label-c">{label}</label>
      <input className="form-control-c" id={id} value={form[id]} onChange={set(id)} {...props} />
    </div>
  )

  return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'calc(100vh - 130px)', padding:'2rem 1rem', background:'var(--bg)' }}>
      <div className="card-c" style={{ width:'100%', maxWidth:520 }}>
        <h2 style={{ marginBottom:'0.25rem' }}>Создать аккаунт</h2>
        <p style={{ color:'var(--muted)', fontSize:'0.9rem', marginBottom:'1.75rem' }}>
          Присоединяйтесь к сообществу читателей
        </p>

        <form onSubmit={submit} noValidate>
          <div className="row g-3">
            <div className="col-md-6">
              <Field label="Email *" id="email" type="email" placeholder="your@email.com" autoComplete="email" />
            </div>
            <div className="col-md-6">
              <Field label="Имя пользователя *" id="username" placeholder="reader42" />
            </div>
            <div className="col-12">
              <Field label="Полное имя" id="full_name" placeholder="Иван Петров" />
            </div>
            <div className="col-12">
              <Field label="Город" id="city" placeholder="Москва" />
            </div>
            <div className="col-md-6">
              <Field label="Пароль *" id="password" type="password" placeholder="мин. 6 символов" autoComplete="new-password" />
            </div>
            <div className="col-md-6">
              <Field label="Повтор пароля *" id="password2" type="password" placeholder="повторите пароль" />
            </div>
          </div>

          {error && <p style={{ color:'var(--danger)', fontSize:'0.87rem', marginTop:'1rem', marginBottom:0 }}>{error}</p>}

          <button type="submit" className="btn-primary-c w-100 justify-content-center mt-4" disabled={loading}>
            {loading ? <><span className="spinner-c" /> Создаём аккаунт…</> : 'Зарегистрироваться'}
          </button>
        </form>

        <p style={{ textAlign:'center', marginTop:'1.25rem', fontSize:'0.87rem', color:'var(--muted)' }}>
          Уже есть аккаунт?{' '}
          <Link to="/login" style={{ fontWeight:600 }}>Войти</Link>
        </p>
      </div>
    </div>
  )
}
