import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import TextField from '../shared/TextField'
import Button from '../shared/Button'
import { useAuth } from '../../context/AuthContext'

export default function LoginForm() {
  const { login, register } = useAuth()
  const navigate = useNavigate()
  const [mode, setMode] = useState('login')

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student',
  })
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const isLogin = mode === 'login'

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }))
  }

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    setBusy(true)
    try {
      if (isLogin) {
        await login(form.email, form.password)
      } else {
        await register({
          name: form.name,
          email: form.email,
          password: form.password,
          role: form.role,
        })
      }
      navigate('/dashboard', { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <form className="flex w-full flex-col gap-8" onSubmit={onSubmit}>
      <header className="flex flex-col items-start gap-1">
        <h1 className="m-0 text-[48px] font-black leading-none">
          {isLogin ? 'LOGIN' : 'SIGN UP'}
        </h1>
        <span className="text-[10px] font-bold tracking-[1px] text-sf-secondary-text">
          {isLogin ? 'ACCESS YOUR ACADEMIC PORTAL' : 'CREATE YOUR DIBIEDU ACCOUNT'}
        </span>
      </header>

      {!isLogin && (
        <TextField
          label="FULL NAME"
          hint="Jane Doe"
          value={form.name}
          onChange={update('name')}
        />
      )}

      <TextField
        label="EMAIL ADDRESS"
        hint="student@dibiedu.edu"
        leadingIcon="email"
        type="email"
        value={form.email}
        onChange={update('email')}
      />

      <div className="flex flex-col gap-4">
        <TextField
          label="PASSWORD"
          hint="••••••••"
          leadingIcon="lock"
          type="password"
          value={form.password}
          onChange={update('password')}
        />
        {isLogin && (
          <div className="flex justify-end">
            <Button variant="ghost" size="small" type="button">
              FORGOT PASSWORD?
            </Button>
          </div>
        )}
      </div>

      {!isLogin && (
        <label className="flex flex-col gap-1">
          <span className="text-[10px] font-bold tracking-[1px] text-sf-secondary-text">
            I AM A
          </span>
          <select
            className="rounded border border-sf-divider bg-transparent px-3 py-3 font-sans text-sf-text outline-none"
            value={form.role}
            onChange={update('role')}
          >
            <option value="student">STUDENT</option>
            <option value="instructor">INSTRUCTOR</option>
          </select>
        </label>
      )}

      {error && (
        <p className="m-0 text-xs font-bold text-[#e11b22]" role="alert">
          {error}
        </p>
      )}

      <Button variant="primary" size="large" fullWidth loading={busy} type="submit">
        {isLogin ? 'SIGN IN' : 'CREATE ACCOUNT'}
      </Button>

      <div className="flex items-center gap-4 text-sf-secondary-text">
        <span aria-hidden="true" className="h-px flex-1 bg-sf-divider" />
        <span className="text-[10px] font-bold tracking-[1px]">
          {isLogin ? 'NEW HERE?' : 'ALREADY HAVE AN ACCOUNT?'}
        </span>
        <span aria-hidden="true" className="h-px flex-1 bg-sf-divider" />
      </div>

      <div className="flex items-center justify-center gap-1 text-[10px] font-bold tracking-[1px] text-sf-secondary-text">
        <span>{isLogin ? 'NEW STUDENT?' : 'BACK TO'}</span>
        <Button
          variant="ghost"
          size="small"
          type="button"
          onClick={() => setMode(isLogin ? 'register' : 'login')}
        >
          {isLogin ? 'SIGN UP' : 'LOGIN'}
        </Button>
      </div>
    </form>
  )
}
