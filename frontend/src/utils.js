const COVER_COLORS = [
  ['#2C5F2E','#1A3D1B'], ['#1A3D8F','#0E2456'], ['#8B2252','#5C1636'],
  ['#7B3F00','#4E2800'], ['#4A4A8A','#2D2D5C'], ['#1A6B6B','#0E4040'],
  ['#8B4513','#5C2D0D'], ['#2C4770','#162440'], ['#6B2D6B','#3D173D'],
]
const AVATAR_COLORS = ['#2C5F2E','#1A3D8F','#8B2252','#7B3F00','#4A4A8A','#1A6B6B','#8B4513']

function strHash(str = '') {
  let h = 0
  for (let i = 0; i < str.length; i++) h = str.charCodeAt(i) + ((h << 5) - h)
  return Math.abs(h)
}

export function coverGradient(title = '') {
  const [c1, c2] = COVER_COLORS[strHash(title) % COVER_COLORS.length]
  return `linear-gradient(145deg, ${c1}, ${c2})`
}

export function avatarColor(username = '') {
  return AVATAR_COLORS[strHash(username) % AVATAR_COLORS.length]
}

export function firstLetter(str = '') {
  return (str || '?').charAt(0).toUpperCase()
}

export const GENRE_LABELS = {
  fiction:'Художественная', nonfiction:'Нон-фикшн', science:'Наука',
  history:'История', biography:'Биография', children:'Детская',
  fantasy:'Фэнтези', detective:'Детектив', romance:'Романтика', other:'Другое',
}
export const CONDITION_LABELS = {
  new:'Новая', good:'Хорошее', fair:'Удовлетворительное', poor:'Плохое',
}
export const STATUS_LABELS = {
  available:'Доступна', in_exchange:'В обмене', exchanged:'Обменяна',
}
export const EXCHANGE_STATUS_LABELS = {
  pending:'Ожидает', accepted:'Принят', rejected:'Отклонён',
  completed:'Завершён', cancelled:'Отменён',
}

export function formatDate(iso) {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('ru-RU', { day:'numeric', month:'long', year:'numeric' })
}

export function starsHtml(rating) {
  const r = Math.round(rating)
  return Array.from({ length: 5 }, (_, i) => i < r ? '★' : '☆').join('')
}
