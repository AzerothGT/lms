import { NavLink, useNavigate } from 'react-router-dom'
import {
  SquaresFour,
  Books,
  Notebook,
  ChartLineUp,
  Gear,
  SignOut,
  UsersThree,
  ChalkboardTeacher,
} from '@phosphor-icons/react'
import { useAuth } from '../../../context/AuthContext'

const nav = [
  { to: '/dashboard', label: 'DASHBOARD', Icon: SquaresFour },
  { to: '/dashboard/courses', label: 'COURSES', Icon: Books },
  { to: '/assignments', label: 'ASSIGNMENTS', Icon: Notebook },
  { to: '/reports', label: 'REPORTS', Icon: ChartLineUp },
  { to: '/settings', label: 'SETTINGS', Icon: Gear },
  { to: '/users', label: 'USERS', Icon: UsersThree, adminOnly: true },
  { to: '/classes', label: 'CLASSES', Icon: ChalkboardTeacher },
]

function initials(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0])
    .join('')
    .toUpperCase()
}

export default function Sidebar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const name = user?.name ?? 'Guest User'

  function handleLogout() {
    logout()
    navigate('/auth', { replace: true })
  }

  return (
    <aside className="flex w-70 flex-none flex-col border-r border-sf-divider bg-sf-secondary-bg max-md:hidden">
      <div className="flex flex-col gap-1 px-6 py-8">
        <span className="text-[34px] font-black leading-[0.8]">DIBI</span>
        <span className="text-[34px] font-black leading-[0.8] text-sf-primary">
          EDU
        </span>
      </div>

      <nav className="flex flex-1 flex-col gap-1 px-4">
        {nav
          .filter(({ adminOnly }) => !adminOnly || user?.role === 'admin')
          .map(({ to, label, Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              [
                'flex items-center gap-3 rounded px-4 py-3 text-[12px] font-bold tracking-[1px] transition',
                isActive
                  ? 'bg-sf-primary/10 text-sf-primary'
                  : 'text-sf-secondary-text hover:text-sf-text',
              ].join(' ')
            }
          >
            <Icon size={20} weight="bold" />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="m-4 flex items-center gap-3 rounded bg-sf-bg p-4">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-sf-primary text-[12px] font-bold text-sf-on-primary">
          {initials(name)}
        </span>
        <div className="flex min-w-0 flex-1 flex-col">
          <span className="truncate text-[14px] font-bold">{name}</span>
          <span className="truncate text-[10px] font-bold tracking-[1px] text-sf-secondary-text">
            STUDENT ID: 8821
          </span>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          aria-label="Logout"
          className="text-sf-secondary-text transition hover:text-sf-primary"
        >
          <SignOut size={20} weight="bold" />
        </button>
      </div>
    </aside>
  )
}
