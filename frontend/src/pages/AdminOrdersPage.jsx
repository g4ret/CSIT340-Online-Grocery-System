import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

const orderStatuses = [
  'All Orders',
  'Pending',
  'Packed',
  'Out for delivery',
  'Delivered',
  'Cancelled',
]

function AdminOrdersPage({ onNavigate, showToast }) {
  const [orders, setOrders] = useState([])
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All Orders')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedOrderId, setSelectedOrderId] = useState(null)
  const [selectedOrderItems, setSelectedOrderItems] = useState([])
  const [isDetailsLoading, setIsDetailsLoading] = useState(false)

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

  const handleLoadOrderItems = async (orderId) => {
    setIsDetailsLoading(true)
    setSelectedOrderItems([])

    try {
      const { data, error } = await supabase
        .from('order_items')
        .select('*')
        .eq('order_id', orderId)
        .order('created_at', { ascending: true })

      if (error) {
        console.error('Error loading order items', error)
        if (showToast) {
          showToast('Failed to load order details. Please try again.', 'error')
        }
        setSelectedOrderItems([])
      } else {
        setSelectedOrderItems(data || [])
      }
    } catch (err) {
      console.error('Unexpected error loading order items', err)
      if (showToast) {
        showToast('Failed to load order details. Please try again.', 'error')
      }
    } finally {
      setIsDetailsLoading(false)
    }
  }

  const handleEditClick = (orderId) => {
    if (selectedOrderId === orderId) {
      setSelectedOrderId(null)
      setSelectedOrderItems([])
      return
    }

    setSelectedOrderId(orderId)
    handleLoadOrderItems(orderId)
  }

  const handleStatusChange = async (orderId, newStatus) => {
    const previous = orders.find((order) => order.id === orderId)
    if (!previous || previous.status === newStatus) return

    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId)

      if (error) {
        console.error('Error updating order status', error)
        if (showToast) {
          showToast('Failed to update order status. Please try again.', 'error')
        }
        return
      }

      setOrders((previousOrders) =>
        previousOrders.map((order) =>
          order.id === orderId
            ? {
                ...order,
                status: newStatus,
              }
            : order
        )
      )

      if (showToast) {
        showToast('Order status updated.', 'success')
      }
    } catch (err) {
      console.error('Unexpected error updating order status', err)
      if (showToast) {
        showToast('Failed to update order status. Please try again.', 'error')
      }
    }
  }

  const handleCancelOrder = (orderId) => {
    handleStatusChange(orderId, 'Cancelled')
  }

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
                <select
                  value={order.status}
                  onChange={(event) => handleStatusChange(order.id, event.target.value)}
                >
                  {orderStatuses
                    .filter((option) => option !== 'All Orders')
                    .map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                </select>
                <button
                  type="button"
                  className="edit"
                  onClick={() => handleEditClick(order.id)}
                >
                  Edit
                </button>
                <button
                  type="button"
                  className="danger"
                  onClick={() => handleCancelOrder(order.id)}
                >
                  Delete
                </button>
              </div>
            </article>
          ))}
        </section>

        {selectedOrderId && (
          <section className="admin-orders__details">
            <h2>Order details</h2>
            <div className="admin-orders__details-body">
              {isDetailsLoading ? (
                <p>Loading order items...</p>
              ) : selectedOrderItems.length === 0 ? (
                <p>No items found for this order.</p>
              ) : (
                <table>
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Qty</th>
                      <th>Unit price</th>
                      <th>Line total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedOrderItems.map((item) => (
                      <tr key={item.id}>
                        <td>{item.product_name}</td>
                        <td>{item.quantity}</td>
                        <td>₱{Number(item.unit_price || 0).toFixed(2)}</td>
                        <td>₱{Number(item.line_total || 0).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </section>
        )}
      </div>
    </main>
  )
}

export default AdminOrdersPage
