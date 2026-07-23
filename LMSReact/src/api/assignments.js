import { api } from './client'

export const assignmentsApi = {
  list: (params = {}) => {
    const qs = new URLSearchParams(
      Object.entries(params).filter(([, v]) => v != null && v !== ''),
    ).toString()
    return api.get(`/assignments${qs ? `?${qs}` : ''}`)
  },
  create: (data) => api.post('/assignments', data),
  submit: (id, payload) => api.post(`/assignments/${id}/submit`, payload),
  delete: (id) => api.del(`/assignments/${id}`),
}
