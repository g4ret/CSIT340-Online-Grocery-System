const navLinks = [
  { id: 'category', label: 'Category' },
  { id: 'home', label: 'Home' },
  { id: 'contact', label: 'Contact' },
  { id: 'about', label: 'About' },
]

function SiteHeader({ activePage, onNavigate }) {
  const handleNavClick = (event, linkId) => {
    event.preventDefault()
    if (onNavigate) {
      onNavigate(linkId)
    }
  }

  return (
    <header className="site-header">
      <div className="brand">
        <span role="img" aria-label="cart">
          🛒
        </span>
        <div>
          <strong>Online Grocery</strong>
          <small>Fresh finds daily</small>
        </div>
      </div>

      <nav className="site-nav">
        {navLinks.map((link) => (
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
        <div className="toolbar-search">
          <input placeholder="What are you looking for?" />
          <button type="button">🔍</button>
        </div>
        <button type="button" aria-label="wishlist">
          ♡
        </button>
        <button type="button" aria-label="notifications">
          🔔
        </button>
        <button type="button" aria-label="cart">
          🛒
        </button>
        <button
          type="button"
          aria-label="profile"
          className={activePage === 'profile' ? 'profile-active' : undefined}
          onClick={() => onNavigate && onNavigate('profile')}
        >
          👤
        </button>
      </div>
    </header>
  )
}

export default SiteHeader

