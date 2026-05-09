import api from './api'

export const activityService = {
  getAll: ({ page = 0, size = 20, sort = 'occurredAt,desc', customerId, dealId, type } = {}) => {
    const params = { page, size, sort }
    if (customerId) params.customerId = customerId
    if (dealId)     params.dealId     = dealId
    if (type)       params.type       = type
    return api.get('/activities', { params })
  },

  getById: (id)           => api.get(`/activities/${id}`),
  create:  (payload)      => api.post('/activities', payload),
  update:  (id, payload)  => api.put(`/activities/${id}`, payload),
  remove:  (id)           => api.delete(`/activities/${id}`),
}
