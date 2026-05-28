import { useState, useEffect } from 'react'
import { api } from '../api'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { coverGradient, firstLetter, GENRE_LABELS, CONDITION_LABELS, STATUS_LABELS } from '../utils'
import { useNavigate } from 'react-router-dom'

const BLANK = { title:'', author:'', genre:'fiction', condition:'good', description:'' }

export default function MyBooks() {
  const { user } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()

  const [books, setBooks]     = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal]     = useState(false)
  const [form, setForm]       = useState(BLANK)
  const [editId, setEditId]   = useState(null)
  const [saving, setSaving]   = useState(false)
  const [delId, setDelId]     = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [formError, setFormError] = useState('')

  const load = () => {
    setLoading(true)
    api.getUserBooks(user.id).then(setBooks).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  const openAdd = () => { setForm(BLANK); setEditId(null); setFormError(''); setModal(true) }

  const openEdit = b => {
    setForm({ title:b.title, author:b.author, genre:b.genre, condition:b.condition, description:b.description||'' })
    setEditId(b.id); setFormError(''); setModal(true)
  }

  const save = async () => {
    setFormError('')
    if (!form.title.trim() || !form.author.trim()) { setFormError('Заполните название и автора'); return }
    setSaving(true)
    try {
      if (editId) await api.updateBook(editId, form)
      else        await api.createBook(form)
      setModal(false)
      toast(editId ? 'Книга обновлена' : 'Книга добавлена!', 'success')
      load()
    } catch (e) { setFormError(e.message) }
    finally { setSaving(false) }
  }

  const confirmDelete = async () => {
    setDeleting(true)
    try {
      await api.deleteBook(delId)
      setDelId(null)
      toast('Книга удалена', 'success')
      load()
    } catch (e) { toast(e.message, 'error') }
    finally { setDeleting(false) }
  }

  return (
    <>
      <div className="container" style={{ padding:'2rem 0 4rem' }}>
        <div className="page-header-c d-flex align-items-center justify-content-between flex-wrap gap-3">
          <div>
            <h1>Мои книги</h1>
            <p style={{ color:'var(--muted)', margin:0 }}>Управляйте своей библиотекой</p>
          </div>
          <button className="btn-primary-c" onClick={openAdd}>+ Добавить книгу</button>
        </div>

        {loading ? (
          <div className="loading-c"><span className="spinner-c spinner-dark" /></div>
        ) : books.length ? (
          <div className="row g-3">
            {books.map(b => <MyBookCard key={b.id} book={b} onEdit={openEdit} onDelete={setDelId} />)}
          </div>
        ) : (
          <div className="empty-c">
            <span className="empty-icon-c">📚</span>
            <h4>У вас пока нет книг</h4>
            <p>Добавьте книги, которые готовы отдать в обмен</p>
            <button className="btn-primary-c" onClick={openAdd}>+ Добавить первую книгу</button>
          </div>
        )}
      </div>

      {/* ADD/EDIT MODAL */}
      {modal && (
        <div className="modal-overlay-c" onClick={e => e.target === e.currentTarget && setModal(false)}>
          <div className="modal-box-c" style={{ maxWidth:540 }}>
            <h4 style={{ marginBottom:'1.5rem' }}>{editId ? 'Редактировать книгу' : 'Добавить книгу'}</h4>
            <div className="row g-3">
              <div className="col-12">
                <label className="form-label-c">Название *</label>
                <input className="form-control-c" placeholder="Мастер и Маргарита" value={form.title} onChange={set('title')} />
              </div>
              <div className="col-12">
                <label className="form-label-c">Автор *</label>
                <input className="form-control-c" placeholder="Михаил Булгаков" value={form.author} onChange={set('author')} />
              </div>
              <div className="col-md-6">
                <label className="form-label-c">Жанр</label>
                <select className="form-select-c" value={form.genre} onChange={set('genre')}>
                  {Object.entries(GENRE_LABELS).map(([k,v]) => <option key={k} value={k}>{v}</option>)}
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label-c">Состояние</label>
                <select className="form-select-c" value={form.condition} onChange={set('condition')}>
                  {Object.entries(CONDITION_LABELS).map(([k,v]) => <option key={k} value={k}>{v}</option>)}
                </select>
              </div>
              <div className="col-12">
                <label className="form-label-c">Описание</label>
                <textarea className="form-control-c" rows={3} placeholder="Краткое описание…" value={form.description} onChange={set('description')} />
              </div>
            </div>
            {formError && <p style={{ color:'var(--danger)', fontSize:'0.85rem', margin:'0.75rem 0 0' }}>{formError}</p>}
            <div className="d-flex gap-2 justify-content-end mt-3">
              <button className="btn-ghost-c" onClick={() => setModal(false)}>Отмена</button>
              <button className="btn-primary-c" onClick={save} disabled={saving}>
                {saving ? <><span className="spinner-c" /> Сохраняем…</> : 'Сохранить'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE MODAL */}
      {delId !== null && (
        <div className="modal-overlay-c" onClick={e => e.target === e.currentTarget && setDelId(null)}>
          <div className="modal-box-c modal-box-sm-c" style={{ textAlign:'center' }}>
            <div style={{ fontSize:'2.5rem', marginBottom:'0.75rem' }}>🗑️</div>
            <h4>Удалить книгу?</h4>
            <p style={{ color:'var(--muted)', fontSize:'0.9rem', margin:'0.5rem 0 1.5rem' }}>
              Это действие нельзя отменить
            </p>
            <div className="d-flex gap-2 justify-content-center">
              <button className="btn-ghost-c" onClick={() => setDelId(null)}>Отмена</button>
              <button className="btn-danger-c" onClick={confirmDelete} disabled={deleting}>
                {deleting ? '…' : 'Удалить'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

function MyBookCard({ book, onEdit, onDelete }) {
  const navigate = useNavigate()
  return (
    <div className="col-sm-6 col-md-4 col-lg-3">
      <div className="book-card-c" style={{ cursor:'default' }}>
        <div className="book-cover-c" style={{ background: coverGradient(book.title), cursor:'pointer' }}
          onClick={() => navigate(`/books/${book.id}`)}>
          <span className="book-letter-c">{firstLetter(book.title)}</span>
        </div>
        <div className="book-body-c">
          <div className="book-title-c">{book.title}</div>
          <div className="book-author-c">{book.author}</div>
          <div className="book-meta-c">
            <span className="badge-c badge-genre-c">{GENRE_LABELS[book.genre]}</span>
            <span className={`badge-c badge-${book.condition}`}>{CONDITION_LABELS[book.condition]}</span>
          </div>
          <div style={{ marginTop:'0.3rem' }}>
            <span className={`badge-c badge-${book.status}`}>{STATUS_LABELS[book.status]}</span>
          </div>
          <div className="d-flex gap-1 mt-2 pt-2" style={{ borderTop:'1px solid var(--border)' }}>
            <button className="btn-ghost-c flex-fill" style={{ fontSize:'0.78rem', padding:'0.3rem' }}
              onClick={() => onEdit(book)}>✏️ Изм.</button>
            <button className="btn-ghost-c flex-fill" style={{ fontSize:'0.78rem', padding:'0.3rem', color:'var(--danger)' }}
              onClick={() => onDelete(book.id)}>🗑️ Уд.</button>
          </div>
        </div>
      </div>
    </div>
  )
}
