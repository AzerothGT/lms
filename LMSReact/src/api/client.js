import axios from 'axios'

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? '/api',
  headers: { 'Content-Type': 'application/json' },
})

client.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

client.interceptors.response.use(
  (res) => res.data?.data ?? res.data,
  (err) => {
    const message = err.response?.data?.message || err.message
    return Promise.reject(new Error(message))
  },
)

export const api = {
  get: (path) => client.get(path),
  post: (path, body) => client.post(path, body),
  put: (path, body) => client.put(path, body),
  del: (path) => client.delete(path),
}
