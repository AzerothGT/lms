import { createContext, useContext, useEffect, useState } from 'react'
import { authApi } from '../api/auth'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(() => localStorage.getItem('token'))
  const [loading, setLoading] = useState(Boolean(localStorage.getItem('token')))

  useEffect(() => {
    if (!token) return
    authApi
      .me()
      .then(setUser)
      .catch(() => logout())
      .finally(() => setLoading(false))
  }, [token])

  function persist(token, user) {
    localStorage.setItem('token', token)
    setToken(token)
    setUser(user)
  }

  async function login(email, password) {
    const { user, token } = await authApi.login(email, password)
    persist(token, user)
    return user
  }

  async function register(payload) {
    const { user, token } = await authApi.register(payload)
    persist(token, user)
    return user
  }

  function logout() {
    authApi.logout().catch(() => {})
    localStorage.removeItem('token')
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}
