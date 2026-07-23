import { useEffect, useState } from 'react'
import { usersApi } from '../../api/users'
import Button from '../shared/Button'
import Dropdown from '../shared/Dropdown'
import Modal from '../shared/Modal'
import TextField from '../shared/TextField'
import { PlusIcon } from '@phosphor-icons/react'

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

  // Form modal state
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'student' })
  const [submitting, setSubmitting] = useState(false)

  // Delete modal state
  const [deletingUser, setDeletingUser] = useState(null)
  const [deleting, setDeleting] = useState(false)

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

  function resetForm() {
    setForm({ name: '', email: '', password: '', role: 'student' })
    setEditingId(null)
    setShowForm(false)
  }

  function handleEditClick(user) {
    setEditingId(user.id)
    setForm({
      name: user.name || '',
      email: user.email || '',
      password: '',
      role: user.role || 'student',
    })
    setShowForm(true)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    try {
      if (editingId) {
        const payload = {
          name: form.name,
          email: form.email,
          role: form.role,
        }
        if (form.password.trim()) {
          payload.password = form.password
        }
        await usersApi.update(editingId, payload)
      } else {
        await usersApi.create(form)
      }
      resetForm()
      load()
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  async function confirmDelete() {
    if (!deletingUser) return
    setDeleting(true)
    try {
      await usersApi.delete(deletingUser.id)
      setUsers((prev) => prev.filter((u) => u.id !== deletingUser.id))
      setDeletingUser(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="m-0 text-[48px] font-black leading-none max-md:text-[32px]">USER MANAGEMENT</h1>
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
          <Button
            variant="primary"
            size="medium"
            onClick={() => {
              resetForm()
              setShowForm(true)
            }}
          >
            <PlusIcon size={16} className="mr-1 inline" /> ADD USER
          </Button>
        </div>
      </header>

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
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="small"
                        type="button"
                        onClick={() => handleEditClick(u)}
                      >
                        EDIT
                      </Button>
                      <Button
                        variant="ghost"
                        size="small"
                        type="button"
                        onClick={() => setDeletingUser(u)}
                      >
                        DELETE
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* User Create / Edit Modal */}
      <Modal open={showForm} onClose={resetForm} title={editingId ? 'EDIT USER' : 'NEW USER'}>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <TextField
            label="FULL NAME"
            placeholder="User full name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <TextField
            label="EMAIL ADDRESS"
            type="email"
            placeholder="user@example.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
          <TextField
            label="PASSWORD"
            type="password"
            placeholder={editingId ? 'New password (optional)' : 'Min 8 characters'}
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required={!editingId}
            minLength={form.password ? 8 : undefined}
          />
          <Dropdown
            label="USER ROLE"
            value={form.role}
            onChange={(val) => setForm({ ...form, role: val })}
            options={[
              { value: 'student', label: 'STUDENT', description: 'Access student courses & materials' },
              { value: 'instructor', label: 'INSTRUCTOR', description: 'Create & manage assigned courses' },
              { value: 'admin', label: 'ADMIN', description: 'Full system administration' },
            ]}
          />

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" size="medium" type="button" onClick={resetForm}>
              CANCEL
            </Button>
            <Button variant="primary" size="medium" type="submit" disabled={submitting}>
              {submitting ? (editingId ? 'SAVING...' : 'CREATING...') : editingId ? 'UPDATE USER' : 'CREATE USER'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete User Confirmation Modal */}
      <Modal open={!!deletingUser} onClose={() => setDeletingUser(null)} title="DELETE USER">
        <div className="flex flex-col gap-4">
          <p className="m-0 text-sm text-sf-secondary-text">
            Are you sure you want to delete <strong className="text-sf-text">{deletingUser?.name}</strong> ({deletingUser?.email})? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" size="medium" type="button" onClick={() => setDeletingUser(null)}>
              CANCEL
            </Button>
            <Button variant="primary" size="medium" type="button" onClick={confirmDelete} disabled={deleting}>
              {deleting ? 'DELETING...' : 'CONFIRM DELETE'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
