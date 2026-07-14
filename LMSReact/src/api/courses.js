import { api } from './client'

export const coursesApi = {
  list: (params = {}) => {
    const qs = new URLSearchParams(
      Object.entries(params).filter(([, v]) => v != null && v !== ''),
    ).toString()
    return api.get(`/courses${qs ? `?${qs}` : ''}`)
  },
}
