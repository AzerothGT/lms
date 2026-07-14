import { api } from './client'

export const authApi = {
  login: (email, password) => api.post('/login', { email, password }),
  register: (payload) => api.post('/register', payload),
  logout: () => api.post('/logout'),
  me: () => api.get('/user'),
}
