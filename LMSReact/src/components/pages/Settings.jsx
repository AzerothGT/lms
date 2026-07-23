import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import Button from '../shared/Button'
import Card from '../shared/Card'
import TextField from '../shared/TextField'
import { UserIcon, LockIcon, CheckCircleIcon } from '@phosphor-icons/react'

export default function Settings() {
  const { user } = useAuth()
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
  })
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [msg, setMsg] = useState('')
  const [err, setErr] = useState('')
  const [saving, setSaving] = useState(false)

  function handleSaveProfile(e) {
    e.preventDefault()
    setSaving(true)
    setErr('')
    setTimeout(() => {
      setMsg('Profile updated successfully.')
      setSaving(false)
      setTimeout(() => setMsg(''), 3000)
    }, 600)
  }

  function handleSavePassword(e) {
    e.preventDefault()
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setErr('New passwords do not match.')
      return
    }
    setSaving(true)
    setErr('')
    setTimeout(() => {
      setMsg('Password changed successfully.')
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
      setSaving(false)
      setTimeout(() => setMsg(''), 3000)
    }, 600)
  }

  return (
    <div className="flex flex-col gap-10">
      <header className="flex flex-col gap-1">
        <h1 className="m-0 text-[48px] font-black leading-none max-md:text-[32px]">ACCOUNT SETTINGS</h1>
        <span className="text-[10px] font-bold tracking-[1px] text-sf-secondary-text">
          MANAGE YOUR PROFILE & PREFERENCES
        </span>
      </header>

      {msg && (
        <div className="flex items-center gap-2 rounded bg-[#87d300]/20 p-4 text-xs font-bold text-[#609400]">
          <CheckCircleIcon size={18} /> {msg}
        </div>
      )}

      {err && (
        <div className="rounded bg-[#e11b22]/10 p-4 text-xs font-bold text-[#e11b22]">
          {err}
        </div>
      )}

      <div className="grid grid-cols-2 gap-8 max-lg:grid-cols-1">
        {/* Profile Info */}
        <Card className="flex flex-col gap-6 p-6">
          <div className="flex items-center gap-2 border-b border-sf-divider pb-4">
            <UserIcon size={20} className="text-sf-primary" />
            <h2 className="m-0 text-lg font-black uppercase">PROFILE DETAILS</h2>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-sf-primary text-xl font-black text-white">
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <div>
              <div className="text-base font-bold">{user?.name}</div>
              <div className="text-xs text-sf-secondary-text">{user?.email}</div>
              <span className="mt-1 inline-block rounded bg-sf-secondary-bg px-2 py-0.5 text-[10px] font-bold uppercase tracking-[1px] text-sf-primary">
                ROLE: {user?.role || 'STUDENT'}
              </span>
            </div>
          </div>

          <form onSubmit={handleSaveProfile} className="flex flex-col gap-4">
            <TextField
              label="FULL NAME"
              value={profileForm.name}
              onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
              required
            />
            <TextField
              label="EMAIL ADDRESS"
              type="email"
              value={profileForm.email}
              onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
              required
            />
            <div className="flex justify-end pt-2">
              <Button variant="primary" size="medium" type="submit" disabled={saving}>
                {saving ? 'SAVING...' : 'SAVE CHANGES'}
              </Button>
            </div>
          </form>
        </Card>

        {/* Change Password */}
        <Card className="flex flex-col gap-6 p-6">
          <div className="flex items-center gap-2 border-b border-sf-divider pb-4">
            <LockIcon size={20} className="text-sf-primary" />
            <h2 className="m-0 text-lg font-black uppercase">CHANGE PASSWORD</h2>
          </div>

          <form onSubmit={handleSavePassword} className="flex flex-col gap-4">
            <TextField
              label="CURRENT PASSWORD"
              type="password"
              placeholder="••••••••"
              value={passwordForm.currentPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
              required
            />
            <TextField
              label="NEW PASSWORD"
              type="password"
              placeholder="Min 8 characters"
              value={passwordForm.newPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
              required
            />
            <TextField
              label="CONFIRM NEW PASSWORD"
              type="password"
              placeholder="Re-enter new password"
              value={passwordForm.confirmPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
              required
            />
            <div className="flex justify-end pt-2">
              <Button variant="primary" size="medium" type="submit" disabled={saving}>
                {saving ? 'UPDATING...' : 'UPDATE PASSWORD'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  )
}
