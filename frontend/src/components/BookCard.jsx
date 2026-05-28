import { useNavigate } from 'react-router-dom'
import { coverGradient, avatarColor, firstLetter, GENRE_LABELS, CONDITION_LABELS } from '../utils'

export default function BookCard({ book }) {
  const navigate = useNavigate()
  const ownerName = book.owner.full_name || book.owner.username

  return (
    <div className="book-card-c" onClick={() => navigate(`/books/${book.id}`)}>
      <div className="book-cover-c" style={{ background: coverGradient(book.title) }}>
        <span className="book-letter-c">{firstLetter(book.title)}</span>
      </div>
      <div className="book-body-c">
        <div className="book-title-c">{book.title}</div>
        <div className="book-author-c">{book.author}</div>
        <div className="book-meta-c">
          <span className="badge-c badge-genre-c">{GENRE_LABELS[book.genre] || book.genre}</span>
          <span className={`badge-c badge-${book.condition}`}>{CONDITION_LABELS[book.condition] || book.condition}</span>
        </div>
        <div className="book-footer-c">
          <span className="avatar-c sm" style={{ background: avatarColor(book.owner.username) }}>
            {firstLetter(book.owner.username)}
          </span>
          <span style={{ overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
            {ownerName}{book.owner.city ? ` · ${book.owner.city}` : ''}
          </span>
        </div>
      </div>
    </div>
  )
}
