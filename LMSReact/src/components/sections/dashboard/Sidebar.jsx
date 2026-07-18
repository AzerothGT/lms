import { NavLink, Link, useNavigate } from 'react-router-dom'
import {
  SquaresFourIcon,
  BooksIcon,
  NotebookIcon,
  ChartLineUpIcon,
  GearIcon,
  SignOutIcon,
  UsersThreeIcon,
  ChalkboardTeacherIcon,
} from '@phosphor-icons/react'
import { useAuth } from '../../../context/AuthContext'

const nav = [
  { to: '/dashboard', label: 'DASHBOARD', Icon: SquaresFourIcon },
  { to: '/classes', label: 'CLASSES', Icon: ChalkboardTeacherIcon },
  { to: '/dashboard/courses', label: 'COURSES', Icon: BooksIcon },
  { to: '/assignments', label: 'ASSIGNMENTS', Icon: NotebookIcon },
  { to: '/reports', label: 'REPORTS', Icon: ChartLineUpIcon },
  { to: '/users', label: 'USERS', Icon: UsersThreeIcon, adminOnly: true },
  { to: '/settings', label: 'SETTINGS', Icon: GearIcon },
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
    <aside className="sticky top-0 flex h-screen w-70 flex-none flex-col border-r border-sf-divider bg-sf-secondary-bg max-md:hidden">
      <Link to="/" className="flex flex-col gap-1 px-6 py-8">
        <span className="text-[34px] font-black leading-[0.8]">DIBI</span>
        <span className="text-[34px] font-black leading-[0.8] text-sf-primary">
          EDU
        </span>
      </Link>

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
          className="cursor-pointer text-sf-secondary-text transition hover:text-sf-primary"
        >
          <SignOutIcon size={20} weight="bold" />
        </button>
      </div>
    </aside>
  )
}
