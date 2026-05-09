import api from './api'

export const dealService = {
  getAll: ({ page = 0, size = 20, sort = 'title,asc', customerId, stage } = {}) => {
    const params = { page, size, sort }
    if (customerId) params.customerId = customerId
    if (stage)      params.stage      = stage
    return api.get('/deals', { params })
  },

  getById: (id)           => api.get(`/deals/${id}`),
  create:  (payload)      => api.post('/deals', payload),
  update:  (id, payload)  => api.put(`/deals/${id}`, payload),
  remove:  (id)           => api.delete(`/deals/${id}`),
}
