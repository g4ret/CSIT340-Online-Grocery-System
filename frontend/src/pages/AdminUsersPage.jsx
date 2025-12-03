import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

const userRoles = ['All Users', 'Customer', 'Delivery', 'Admin']

function AdminUsersPage({ onNavigate, showToast }) {
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('All Users')
  const [users, setUsers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchUsers = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const { data, error: queryError } = await supabase
        .from('profiles')
        .select('*')
        .order('full_name', { ascending: true })

      if (queryError) {
        console.error('Error loading users from Supabase profiles', queryError)
        setError('Failed to load users.')
        setUsers([])
        return
      }

      const mapped = (data || []).map((row) => ({
        id: row.id,
        name: row.full_name || 'Unnamed user',
        email: row.email || '—',
        role: row.role || 'Customer',
      }))

      setUsers(mapped)
    } catch (err) {
      console.error('Unexpected error loading users from Supabase', err)
      setError('Failed to load users.')
      setUsers([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const filteredUsers = useMemo(() => {
    const query = search.toLowerCase().trim()

    return users.filter((user) => {
      const name = (user.name || '').toLowerCase()
      const email = (user.email || '').toLowerCase()
      const role = user.role || 'Customer'

      const matchesSearch = !query || name.includes(query) || email.includes(query)
      const matchesRole = roleFilter === 'All Users' || role === roleFilter

      return matchesSearch && matchesRole
    })
  }, [search, roleFilter, users])

  const handleRefresh = () => {
    setSearch('')
    setRoleFilter('All Users')
    fetchUsers()
  }

  const handleEditUser = async (user) => {
    if (!user) return

    const currentRole = user.role || 'Customer'
    const input = window.prompt(
      'Enter new role for this user (Customer, Delivery, Admin):',
      currentRole
    )

    if (!input) {
      return
    }

    const nextRole = input.trim()

    if (!['Customer', 'Delivery', 'Admin'].includes(nextRole)) {
      if (showToast) {
        showToast('Invalid role. Please use Customer, Delivery, or Admin.', 'error')
      }
      return
    }

    if (nextRole === currentRole) {
      return
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: nextRole })
        .eq('id', user.id)

      if (error) {
        console.error('Error updating user role in Supabase profiles', error)
        if (showToast) {
          showToast('Failed to update user role. Please try again.', 'error')
        }
        return
      }

      setUsers((previous) =>
        previous.map((entry) =>
          entry.id === user.id
            ? {
                ...entry,
                role: nextRole,
              }
            : entry
        )
      )

      if (showToast) {
        showToast('User role updated.', 'success')
      }
    } catch (err) {
      console.error('Unexpected error updating user role in Supabase profiles', err)
      if (showToast) {
        showToast('Failed to update user role. Please try again.', 'error')
      }
    }
  }

  const handleDeleteUser = (user) => {
    if (showToast) {
      showToast(
        `User deletion is not available in this demo. Manage accounts via Supabase Auth (user: ${user.email}).`,
        'info'
      )
    }
  }

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
            <button type="button" onClick={handleRefresh}>
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
          {isLoading ? (
            <p>Loading users...</p>
          ) : error ? (
            <p>{error}</p>
          ) : filteredUsers.length === 0 ? (
            <p>No users found.</p>
          ) : (
            filteredUsers.map((user) => (
              <article key={user.id}>
                <span>{user.id}</span>
                <span>{user.name}</span>
                <span>{user.email}</span>
                <span>{user.role}</span>
                <div className="actions">
                  <button
                    type="button"
                    className="edit"
                    onClick={() => handleEditUser(user)}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="danger"
                    onClick={() => handleDeleteUser(user)}
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))
          )}
        </section>
      </div>
    </main>
  )
}

export default AdminUsersPage

