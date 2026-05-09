import axios from 'axios'

const TOKEN_KEY = 'crm_token'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1',
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
})

// ── Request interceptor: attach JWT ──────────────────────────────────────────
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(TOKEN_KEY)
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// ── Response interceptor: unwrap data, handle 401 ────────────────────────────
api.interceptors.response.use(
  (response) => {
    // Backend wraps every response in { success, data, message, timestamp }.
    // Return response.data.data so callers receive the actual payload directly.
    // For void responses (data === null) we still return null, not the wrapper.
    const envelope = response.data
    return envelope && 'data' in envelope ? envelope.data : envelope
  },
  (error) => {
    const isAuthEndpoint = error.config?.url?.includes('/auth/')
    // Only redirect for 401 on protected endpoints — NOT on the login request itself
    if (error.response?.status === 401 && !isAuthEndpoint) {
      localStorage.removeItem(TOKEN_KEY)
      localStorage.removeItem('crm_user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api
