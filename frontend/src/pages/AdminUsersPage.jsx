import { useMemo, useState } from 'react'

const usersData = [
  { id: 3, name: 'John Doe', email: 'johndoe@gmail.com', role: 'Customer' },
  { id: 4, name: 'Rob', email: 'rob@gmail.com', role: 'Delivery' },
  { id: 5, name: 'User', email: 'user@gmail.com', role: 'Customer' },
  { id: 6, name: 'Admin Ops', email: 'admin@lazshoppe.com', role: 'Admin' },
]

const userRoles = ['All Users', 'Customer', 'Delivery', 'Admin']

function AdminUsersPage({ onNavigate }) {
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('All Users')

  const filteredUsers = useMemo(() => {
    return usersData.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(search.toLowerCase().trim()) ||
        user.email.toLowerCase().includes(search.toLowerCase().trim())
      const matchesRole = roleFilter === 'All Users' || user.role === roleFilter
      return matchesSearch && matchesRole
    })
  }, [search, roleFilter])

  return (
    <main className="admin-users">
      <div className="admin-orders__shell">
        <header className="admin-page-header">
          <h1>Users</h1>
        </header>
        <section className="admin-products__controls">
          <div>
            <h2>All Users {filteredUsers.length.toLocaleString()}</h2>
          </div>
          <div className="control-row">
            <input
              type="search"
              placeholder="Search Users"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
            <select value={roleFilter} onChange={(event) => setRoleFilter(event.target.value)}>
              {userRoles.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
            <button type="button" onClick={() => setSearch('')}>
              Refresh
            </button>
          </div>
        </section>

        <section className="admin-users__table">
          <header>
            <span>ID</span>
            <span>Name</span>
            <span>Email</span>
            <span>Role</span>
            <span>Actions</span>
          </header>
          {filteredUsers.map((user) => (
            <article key={user.id}>
              <span>{user.id}</span>
              <span>{user.name}</span>
              <span>{user.email}</span>
              <span>{user.role}</span>
              <div className="actions">
                <button type="button" className="edit">
                  Edit
                </button>
                <button type="button" className="danger">
                  Delete
                </button>
              </div>
            </article>
          ))}
        </section>
      </div>
    </main>
  )
}

export default AdminUsersPage

