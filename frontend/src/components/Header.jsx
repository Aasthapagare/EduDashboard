import { useLocation } from 'react-router-dom'
import Icon from './Icons'
import { navItems } from '../config/navigation'

export default function Header({ menuOpen, onMenuToggle }) {
  const { pathname } = useLocation()
  const current = navItems.find((item) =>
    item.end ? pathname === item.path : pathname.startsWith(item.path),
  )

  return (
    <header className="header">
      <button
        type="button"
        className="icon-button header__menu"
        onClick={onMenuToggle}
        aria-label="Open navigation"
        aria-expanded={menuOpen}
        aria-controls="app-sidebar"
      >
        <Icon name="menu" />
      </button>
      <span className="header__title">{current ? current.title : 'Page not found'}</span>
      <span className="header__badge">Admin</span>
    </header>
  )
}
