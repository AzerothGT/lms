const BASE = import.meta.env.VITE_API_URL ?? '/api'

async function request(path, { method = 'GET', body, headers } = {}) {
  const token = localStorage.getItem('token')
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  })

  const json = await res.json().catch(() => null)

  if (!res.ok) {
    const message = json?.message || `${res.status} ${res.statusText}`
    throw new Error(message)
  }

  return json?.data ?? json
}

export const api = {
  get: (path, opts) => request(path, { ...opts, method: 'GET' }),
  post: (path, body, opts) => request(path, { ...opts, method: 'POST', body }),
  put: (path, body, opts) => request(path, { ...opts, method: 'PUT', body }),
  del: (path, opts) => request(path, { ...opts, method: 'DELETE' }),
}
