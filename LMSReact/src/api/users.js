import { api } from './client'

export const usersApi = {
  list: (params = {}) => {
    const qs = new URLSearchParams(
      Object.entries(params).filter(([, v]) => v != null && v !== ''),
    ).toString()
    return api.get(`/users${qs ? `?${qs}` : ''}`)
  },
  create: (data) => api.post('/users', data),
  delete: (id) => api.del(`/users/${id}`),
}
