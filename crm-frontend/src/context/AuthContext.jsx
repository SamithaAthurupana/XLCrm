import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { authService } from '../services/authService'
import toast from 'react-hot-toast'

const AuthContext = createContext(null)

const TOKEN_KEY = 'crm_token'
const USER_KEY  = 'crm_user'

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(() => {
    try { return JSON.parse(localStorage.getItem(USER_KEY)) } catch { return null }
  })
  const [token, setToken]     = useState(() => localStorage.getItem(TOKEN_KEY))
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  // Persist token + user whenever they change
  useEffect(() => {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token)
    } else {
      localStorage.removeItem(TOKEN_KEY)
    }
  }, [token])

  useEffect(() => {
    if (user) {
      localStorage.setItem(USER_KEY, JSON.stringify(user))
    } else {
      localStorage.removeItem(USER_KEY)
    }
  }, [user])

  const login = useCallback(async (credentials) => {
    setLoading(true)
    try {
      const data = await authService.login(credentials)
      setToken(data.accessToken)
      setUser({
        id:    data.userId,
        name:  data.name,
        email: data.email,
        role:  data.role,
      })
      toast.success(`Welcome back, ${data.name}!`)
      navigate('/dashboard')
    } catch (err) {
      const message = err.response?.data?.message || 'Invalid email or password'
      toast.error(message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [navigate])

  const logout = useCallback(() => {
    setToken(null)
    setUser(null)
    toast.success('Logged out successfully')
    navigate('/login')
  }, [navigate])

  const isAdmin = user?.role === 'ADMIN'

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, isAdmin, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
