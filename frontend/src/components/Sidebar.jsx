import { NavLink } from 'react-router-dom'
import Icon from './Icons'
import logo from '../assets/logo.svg'
import { navItems } from '../config/navigation'

export default function Sidebar({ open, onClose }) {
  return (
    <aside id="app-sidebar" className={`sidebar${open ? ' sidebar--open' : ''}`}>
      <div className="sidebar__brand">
        <img src={logo} alt="" width="32" height="32" />
        <div className="sidebar__brand-text">
          <span className="sidebar__brand-name">Learning Platform</span>
          <span className="sidebar__brand-sub">Admin console</span>
        </div>
        <button
          type="button"
          className="icon-button sidebar__close"
          onClick={onClose}
          aria-label="Close navigation"
        >
          <Icon name="close" />
        </button>
      </div>

      <nav className="sidebar__nav" aria-label="Main navigation">
        <ul>
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                end={item.end}
                className={({ isActive }) =>
                  `sidebar__link${isActive ? ' sidebar__link--active' : ''}`
                }
              >
                <Icon name={item.icon} />
                <span>{item.title}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  )
}
