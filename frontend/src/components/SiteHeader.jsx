import { useState } from 'react'

const customerNavLinks = [
  { id: 'category', label: 'Category' },
  { id: 'home', label: 'Home' },
  { id: 'contact', label: 'Contact' },
  { id: 'about', label: 'About' },
]

const adminNavLinks = [
  { id: 'adminDashboard', label: 'Dashboard' },
  { id: 'adminProducts', label: 'Products' },
  { id: 'adminOrders', label: 'Orders' },
  { id: 'adminUsers', label: 'Users' },
]

function SiteHeader({ activePage, onNavigate, onLogout, userRole, cartCount }) {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)

  const handleNavClick = (event, linkId) => {
    event.preventDefault()
    if (onNavigate) {
      onNavigate(linkId)
    }
  }

  const handleLogout = () => {
    if (onLogout) {
      onLogout()
    }
  }

  const handleProfileClick = () => {
    if (onNavigate) {
      onNavigate('profile')
    }
    setIsUserMenuOpen(false)
  }

  const handleUserMenuLogout = () => {
    setIsUserMenuOpen(false)
    handleLogout()
  }

  return (
    <header className="site-header">
      <div className="header-container">
        <div className="brand">
          <div className="logo-container">
            <svg
              className="cart-logo"
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="cartGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f97316" />
                  <stop offset="100%" stopColor="#ea580c" />
                </linearGradient>
              </defs>
              <path
                d="M7 18C5.9 18 5.01 18.9 5.01 20C5.01 21.1 5.9 22 7 22C8.1 22 9 21.1 9 20C9 18.9 8.1 18 7 18ZM1 2V4H3L6.6 11.59L5.25 14.04C5.09 14.32 5 14.65 5 15C5 16.1 5.9 17 7 17H19V15H7.42C7.28 15 7.17 14.89 7.17 14.75L7.2 14.66L8.1 13H15.55C16.3 13 16.96 12.59 17.3 11.97L20.88 5.48C20.96 5.34 21 5.17 21 5C21 4.45 20.55 4 20 4H5.21L4.27 2H1V2ZM17 18C15.9 18 15.01 18.9 15.01 20C15.01 21.1 15.9 22 17 22C18.1 22 19 21.1 19 20C19 18.9 18.1 18 17 18Z"
                fill="url(#cartGradient)"
              />
            </svg>
          </div>
          <div className="brand-text">
            <strong>LazShoppe</strong>
            <small>Fresh finds daily</small>
          </div>
        </div>

        <nav className="site-nav">
          {(userRole === 'admin' ? adminNavLinks : customerNavLinks).map((link) => (
            <a
              key={link.id}
              href="#"
              className={link.id === activePage ? 'active' : undefined}
              onClick={(event) => handleNavClick(event, link.id)}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="toolbar-actions">
          {userRole && <span className={`role-pill ${userRole}`}>{userRole}</span>}
          {userRole !== 'admin' && (
            <button
              type="button"
              className="cart-btn"
              onClick={(event) => handleNavClick(event, 'addToCart')}
            >
              🛒 {cartCount ?? 0}
            </button>
          )}
          <div className="user-menu">
            <button
              type="button"
              className="user-menu__button"
              onClick={() => setIsUserMenuOpen((open) => !open)}
              aria-haspopup="true"
              aria-expanded={isUserMenuOpen}
            >
              <img src="/image.png" alt="Account" className="user-menu__avatar" />
            </button>
            {isUserMenuOpen && (
              <div className="user-menu__dropdown">
                <button type="button" onClick={handleProfileClick}>
                  Profile
                </button>
                <button type="button" onClick={handleUserMenuLogout}>
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default SiteHeader

