const adminLinks = [
  { id: 'adminDashboard', label: 'Dashboard' },
  { id: 'adminProducts', label: 'Products' },
  { id: 'adminOrders', label: 'Orders' },
  { id: 'adminUsers', label: 'Users' },
]

function AdminSubnav({ activePage, onNavigate }) {
  return (
    <nav className="admin-subnav">
      {adminLinks.map((link) => (
        <button
          key={link.id}
          type="button"
          className={activePage === link.id ? 'active' : undefined}
          onClick={() => onNavigate?.(link.id)}
        >
          {link.label}
        </button>
      ))}
    </nav>
  )
}

export default AdminSubnav

