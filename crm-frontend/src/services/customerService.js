import api from './api'

export const customerService = {
  getAll: ({ page = 0, size = 20, sort = 'name,asc', search, status } = {}) => {
    const params = { page, size, sort }
    if (search) params.search = search
    if (status) params.status = status
    return api.get('/customers', { params })
  },

  getById: (id)           => api.get(`/customers/${id}`),
  create:  (payload)      => api.post('/customers', payload),
  update:  (id, payload)  => api.put(`/customers/${id}`, payload),
  remove:  (id)           => api.delete(`/customers/${id}`),
}
