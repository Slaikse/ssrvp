import { useSelector } from 'react-redux'

export function useLoginState() {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated)
  const user = useSelector((state) => state.auth.user)
  return { isAuthenticated, user }
}
