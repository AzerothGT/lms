import { useNavigate } from 'react-router-dom'
import Icon from '../shared/LogoIcon'
import Button from '../shared/Button'
import { useAuth } from '../../context/AuthContext'

const links = ['COURSES', 'PROGRAMS', 'ABOUT', 'CONTACT']

export default function Header() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/auth', { replace: true })
  }

  return (
    <header className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-sf-divider bg-sf-bg px-8 py-4 max-md:px-4">
      <div className="flex items-center gap-3">
        <Icon name="strapi" size={32} className="text-sf-text" />
        <span className="text-xl font-black tracking-wide">DIBIEDU</span>
      </div>

      <nav className="flex items-center gap-8 max-md:hidden">
        {links.map((link) => (
          <a
            key={link}
            href="#"
            className="text-xs font-bold tracking-[1px] text-sf-secondary-text hover:text-sf-primary"
          >
            {link}
          </a>
        ))}
      </nav>

      <div className="flex items-center gap-2">
        {user ? (
          <>
            <span className="text-xs font-bold tracking-[1px] text-sf-secondary-text">
              {user.name}
            </span>
            <Button variant="ghost" size="small" type="button" onClick={handleLogout}>
              LOGOUT
            </Button>
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
