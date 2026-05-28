import { createContext, useContext, useState, useCallback } from 'react'

const ToastContext = createContext(null)

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const toast = useCallback((msg, type = 'info') => {
    const id = Date.now() + Math.random()
    setToasts(prev => [...prev, { id, msg, type }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500)
  }, [])

  const icons = { success: '✓', error: '✕', warning: '⚠', info: 'ℹ' }

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="toast-wrap-c">
        {toasts.map(t => (
          <div key={t.id} className={`toast-item-c toast-${t.type}`}>
            <span>{icons[t.type] || 'ℹ'}</span>
            <span>{t.msg}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  return useContext(ToastContext)
}
