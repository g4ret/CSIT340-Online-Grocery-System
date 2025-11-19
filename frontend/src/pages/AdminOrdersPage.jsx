import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

const orderStatuses = ['All Orders', 'Pending', 'Packed', 'Out for delivery', 'Delivered']

function AdminOrdersPage({ onNavigate }) {
  const [orders, setOrders] = useState([])
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All Orders')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true)
      setError(null)

      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error loading orders from Supabase', error)
        setError('Failed to load orders.')
        setOrders([])
      } else {
        setOrders(data || [])
      }

      setIsLoading(false)
    }

    fetchOrders()
  }, [])

  const ordersData = useMemo(
    () =>
      orders.map((order) => ({
        id: order.id,
        orderNumber: order.order_number,
        status: order.status || 'Pending',
        totalAmount: Number(order.total_amount) || 0,
        totalItems: order.total_items || 0,
        createdAt: order.created_at,
      })),
    [orders]
  )

  const filteredOrders = useMemo(() => {
    return ordersData.filter((order) => {
      const matchesSearch =
        order.orderNumber?.toLowerCase().includes(search.toLowerCase().trim()) || false
      const matchesStatus = statusFilter === 'All Orders' || order.status === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [ordersData, search, statusFilter])

  return (
    <main className="admin-orders">
      <div className="admin-orders__shell">
        <header className="admin-page-header">
          <h1>Orders</h1>
        </header>
        <section className="admin-products__controls">
          <div>
            <h2>All Orders {filteredOrders.length.toLocaleString()}</h2>
          </div>
          <div className="control-row">
            <input
              type="search"
              placeholder="Search Order no."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
            <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
              {orderStatuses.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <button type="button" onClick={() => setSearch('')}>
              Refresh
            </button>
          </div>
        </section>

        <section className="admin-orders__table">
          <header>
            <span>Order</span>
            <span>Date</span>
            <span>Order No.</span>
            <span>Total</span>
            <span>Status</span>
            <span>Actions</span>
          </header>
          {filteredOrders.map((order) => (
            <article key={order.id}>
              <div className="product-meta">
                <div>
                  <strong>Order {order.orderNumber || order.id}</strong>
                  <p>{order.totalItems} items</p>
                </div>
              </div>
              <span>
                {order.createdAt ? new Date(order.createdAt).toLocaleString() : '—'}
              </span>
              <span>{order.orderNumber || '—'}</span>
              <div className="price-stack">
                <strong>₱{order.totalAmount.toFixed(2)}</strong>
              </div>
              <span className={`status-badge ${order.status.replace(/\s+/g, '-').toLowerCase()}`}>
                {order.status}
              </span>
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

export default AdminOrdersPage

