import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useLoginState } from '../hooks/useLoginState'

function ProtectedRoute({ children, adminOnly = false }) {
  const { isAuthenticated, user } = useLoginState()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (adminOnly && user?.role !== 'admin') {
    return <Navigate to="/" replace />
  }

  return children
}

export default ProtectedRoute
