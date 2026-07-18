import { useEffect, useState } from 'react'
import { usersApi } from '../../api/users'
import Button from '../shared/Button'
import Card from '../shared/Card'

const roleColors = {
  admin: '#e11b22',
  instructor: '#0091c3',
  student: '#87d300',
}

export default function Users() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'student' })
  const [submitting, setSubmitting] = useState(false)

  function load() {
    setLoading(true)
    usersApi
      .list()
      .then((data) => setUsers(Array.isArray(data) ? data : []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  const filtered = users.filter((u) => {
    const q = search.toLowerCase()
    return (
      !q ||
      u.name?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q) ||
      u.role?.toLowerCase().includes(q)
    )
  })

  async function handleCreate(e) {
    e.preventDefault()
    setSubmitting(true)
    try {
      await usersApi.create(form)
      setForm({ name: '', email: '', password: '', role: 'student' })
      setShowForm(false)
      load()
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete(id) {
    if (!confirm('Delete this user?')) return
    try {
      await usersApi.delete(id)
      setUsers((prev) => prev.filter((u) => u.id !== id))
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="m-0 text-[48px] font-black leading-none">USER MANAGEMENT</h1>
          <span className="text-[10px] font-bold tracking-[1px] text-sf-secondary-text">
            MANAGE {users.length} USERS
          </span>
        </div>
        <div className="flex items-center gap-3">
          <label className="flex w-80 items-center gap-2 rounded border border-sf-divider px-3 max-md:w-full">
            <input
              className="w-full bg-transparent py-3 font-sans text-sf-text outline-none placeholder:text-[#888]"
              placeholder="Search users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </label>
          <Button variant="primary" size="medium" onClick={() => setShowForm(!showForm)}>
            {showForm ? 'CANCEL' : 'ADD USER'}
          </Button>
        </div>
      </header>

      {showForm && (
        <Card className="flex flex-col gap-4 p-6">
          <h3 className="m-0 text-lg font-black">NEW USER</h3>
          <form onSubmit={handleCreate} className="flex flex-wrap items-end gap-4">
            <input
              required
              className="flex-1 min-w-40 rounded border border-sf-divider bg-transparent px-4 py-3 text-sm outline-none"
              placeholder="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <input
              required
              type="email"
              className="flex-1 min-w-40 rounded border border-sf-divider bg-transparent px-4 py-3 text-sm outline-none"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <input
              required
              type="password"
              className="flex-1 min-w-40 rounded border border-sf-divider bg-transparent px-4 py-3 text-sm outline-none"
              placeholder="Password (min 8 chars)"
              minLength={8}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
            <select
              className="rounded border border-sf-divider bg-transparent px-4 py-3 text-sm outline-none"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
            >
              <option value="student">STUDENT</option>
              <option value="instructor">INSTRUCTOR</option>
              <option value="admin">ADMIN</option>
            </select>
            <Button variant="primary" size="medium" type="submit" disabled={submitting}>
              {submitting ? 'CREATING...' : 'CREATE'}
            </Button>
          </form>
        </Card>
      )}

      {error && <p className="m-0 text-sm font-bold text-[#e11b22]">{error}</p>}

      {loading && <p className="m-0 text-sm text-sf-secondary-text">Loading users…</p>}

      {!loading && filtered.length === 0 && (
        <p className="m-0 text-sm text-sf-secondary-text">No users found.</p>
      )}

      {!loading && filtered.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-sf-divider text-[10px] font-bold tracking-[1px] text-sf-secondary-text">
                <th className="px-4 py-3">NAME</th>
                <th className="px-4 py-3">EMAIL</th>
                <th className="px-4 py-3">ROLE</th>
                <th className="px-4 py-3 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u.id} className="border-b border-sf-divider hover:bg-sf-secondary-bg/50">
                  <td className="px-4 py-3 font-bold">{u.name}</td>
                  <td className="px-4 py-3 text-sf-secondary-text">{u.email}</td>
                  <td className="px-4 py-3">
                    <span
                      className="rounded-full px-3 py-1 text-[10px] font-bold tracking-[1px] text-white"
                      style={{ backgroundColor: roleColors[u.role] ?? '#888' }}
                    >
                      {u.role?.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button
                      variant="ghost"
                      size="small"
                      type="button"
                      onClick={() => handleDelete(u.id)}
                    >
                      DELETE
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
