import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import Icon from '../shared/LogoIcon'
import Button from '../shared/Button'
import { useAuth } from '../../context/AuthContext'

const links = ['COURSES', 'PROGRAMS', 'ABOUT', 'CONTACT']

export default function Header() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    if (open) document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  function handleLogout() {
    setOpen(false)
    logout()
    navigate('/auth', { replace: true })
  }

  return (
    <header className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-sf-divider bg-sf-bg px-8 py-4 max-md:px-4">
      <Link to="/" className="flex items-center gap-3">
        <Icon name="strapi" size={32} className="text-sf-text" />
        <span className="text-xl font-black tracking-wide">DIBIEDU</span>
      </Link>

      <nav className="flex items-center gap-8 max-md:hidden">
        {links.map((link) => (
          <Link
            key={link}
            to={`/${link.toLowerCase()}`}
            className="text-xs font-bold tracking-[1px] text-sf-secondary-text hover:text-sf-primary"
          >
            {link}
          </Link>
        ))}
      </nav>

      <div className="flex items-center gap-2">
        {user ? (
          <>
            <Link
              to="/dashboard"
              className="text-xs font-bold tracking-[1px] text-sf-secondary-text hover:text-sf-primary"
            >
              DASHBOARD
            </Link>
            <div className="relative" ref={ref}>
              <button
                type="button"
                title={user.name}
                onClick={() => setOpen((o) => !o)}
                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border-0 bg-sf-primary p-0 text-[10px] font-bold text-sf-on-primary"
              >
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="h-full w-full rounded-full object-cover" />
                ) : (
                  user.name?.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2)
                )}
              </button>
              {open && (
                <div className="absolute right-0 top-full z-20 mt-2 w-40 rounded border border-sf-divider bg-sf-bg py-1 shadow-lg">
                  <Link
                    to="/settings"
                    onClick={() => setOpen(false)}
                    className="block px-4 py-2 text-xs font-bold tracking-[1px] text-sf-text no-underline hover:bg-sf-primary hover:text-sf-on-primary"
                  >
                    PROFILE
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="block w-full cursor-pointer border-0 bg-transparent px-4 py-2 text-left text-xs font-bold tracking-[1px] text-sf-text hover:bg-sf-primary hover:text-sf-on-primary"
                  >
                    LOGOUT
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <Button
              variant="ghost"
              size="small"
              type="button"
              onClick={() => navigate('/auth')}
            >
              LOGIN
            </Button>
            <Button
              variant="primary"
              size="small"
              type="button"
              onClick={() => navigate('/auth')}
            >
              GET STARTED
            </Button>
          </>
        )}
      </div>
    </header>
  )
}
