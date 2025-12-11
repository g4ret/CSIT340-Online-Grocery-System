import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

function OrdersPage({ userId, userEmail }) {
  const [orders, setOrders] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [profileAddress, setProfileAddress] = useState(null)
  const [cancellingId, setCancellingId] = useState(null)

  const persistLocalOrders = (nextOrders) => {
    try {
      localStorage.setItem('ordersLocal', JSON.stringify(nextOrders.slice(0, 50)))
    } catch (err) {
      console.error('Error saving orders to local cache', err)
    }
  }

  useEffect(() => {
    const loadLatestOrder = async () => {
      setIsLoading(true)
      setError(null)

      const storedId = typeof localStorage !== 'undefined' ? localStorage.getItem('userId') : null

      try {
        const { data: userResult } = await supabase.auth.getUser()
        const supabaseUser = userResult?.user
        const userIdentifier = supabaseUser?.id || userId || storedId

        if (!userIdentifier) {
          setOrders([])
          setError('Please sign in to view your orders.')
          setIsLoading(false)
          return
        }

        const { data: ordersData, error: ordersError } = await supabase
          .from('orders')
          .select('*')
          .eq('user_id', userIdentifier)
          .order('created_at', { ascending: false })

        if (ordersError) {
          console.error('Error loading orders from Supabase', ordersError)
          setError('Failed to load your orders.')
          setOrders([])
        } else if (ordersData && ordersData.length) {
          setOrders(ordersData)
          persistLocalOrders(ordersData)
        } else {
          // Fallback to local cached orders if Supabase has none (demo)
          try {
            const cached = JSON.parse(localStorage.getItem('ordersLocal') || '[]')
            const filtered =
              Array.isArray(cached) && cached.length
                ? cached.filter((o) => o.user_id === userIdentifier)
                : []
            setOrders(filtered)
          } catch (err) {
            console.error('Error reading local order cache', err)
            setOrders([])
          }
        }

        const user = supabaseUser || { id: userIdentifier, email: userEmail || '' }

        const { data: profileRow, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle()

        if (profileError) {
          console.error('Error loading profile for orders page', profileError)
        }

        if (profileRow) {
          setProfileAddress({
            name: profileRow.full_name || user.user_metadata?.full_name || user.email,
            phone: profileRow.phone || user.user_metadata?.phone || '',
            address: profileRow.address || '',
          })
        } else {
          setProfileAddress({
            name: user.user_metadata?.full_name || user.email,
            phone: user.user_metadata?.phone || '',
            address: '',
          })
        }
      } catch (err) {
        console.error('Unexpected error loading orders page', err)
        try {
          const cached = JSON.parse(localStorage.getItem('ordersLocal') || '[]')
          const filtered =
            Array.isArray(cached) && cached.length
              ? cached.filter((o) => o.user_id === userId || o.user_id === storedId)
              : []
          setOrders(filtered)
          if (!filtered.length) {
            setError('Please sign in to view your orders.')
          }
        } catch (fallbackErr) {
          console.error('Fallback local orders failed', fallbackErr)
          setError('Please sign in to view your orders.')
        }
      } finally {
        setIsLoading(false)
      }
    }

    loadLatestOrder()
  }, [userId, userEmail])

  const formatCurrency = (value) => {
    const numeric = typeof value === 'number' ? value : Number(value)
    if (!Number.isFinite(numeric)) return '0.00'
    return numeric.toFixed(2)
  }

  const getOrderLogisticsNote = (status) => {
    const normalized = (status || '').toLowerCase()

    if (normalized === 'pending') return 'Order received and being prepared.'
    if (normalized === 'packed') return 'Items are packed and ready for dispatch.'
    if (normalized === 'out for delivery') return 'Rider is on the way.'
    if (normalized === 'delivered') return 'Parcel has been delivered.'
    if (normalized === 'cancelled') return 'Order was cancelled.'

    return 'Order status update in progress.'
  }

  const handleCancelOrder = async (orderId) => {
    if (!orderId || cancellingId) return

    setCancellingId(orderId)
    try {
      const { data: userResult } = await supabase.auth.getUser()
      const supabaseUser = userResult?.user
      const userIdentifier = supabaseUser?.id || userId
      if (!userIdentifier) {
        setError('Please sign in to cancel orders.')
        return
      }

      const { error: updateError } = await supabase
        .from('orders')
        .update({ status: 'Cancelled' })
        .eq('id', orderId)
        .eq('user_id', userIdentifier)

      if (updateError) {
        console.error('Error cancelling order', updateError)
        setError('Failed to cancel order. Please try again.')
        return
      }

      setOrders((prev) => {
        const next = prev.map((o) => (o.id === orderId ? { ...o, status: 'Cancelled' } : o))
        persistLocalOrders(next)
        return next
      })
      setError(null)
    } catch (err) {
      console.error('Unexpected error cancelling order', err)
      setError('Failed to cancel order. Please try again.')
    } finally {
      setCancellingId(null)
    }
  }

  const renderOrdersContent = () => {
    if (isLoading) return <p className="orders-empty">Loading your orders...</p>
    if (error) return <p className="orders-empty">{error}</p>
    if (!orders.length) return <p className="orders-empty">You haven't placed any orders yet.</p>

    return (
      <div className="orders-grid">
        {orders.map((order) => {
          const totalAmount = formatCurrency(order.total_amount)
          const createdDate = formatDate(order.created_at)
          const statusLabel = order.status || 'Pending'
          return (
            <article className="order-summary-card" key={order.id}>
              <div className="order-summary__header">
                <div>
                  <p className="order-number">{order.order_number || order.id}</p>
                  {createdDate && <small>{createdDate}</small>}
                </div>
                <span className="status-pill">{statusLabel}</span>
              </div>
              <div className="order-summary__meta">
                <div className="meta-block">
                  <p className="meta-label">Total Payment</p>
                  <strong>₱{totalAmount}</strong>
                </div>
                <div className="meta-block">
                  <p className="meta-label">Logistics</p>
                  <small>{getOrderLogisticsNote(order.status)}</small>
                </div>
              </div>
              {['Pending', 'Packed', 'pending', 'packed'].includes(order.status || '') && (
                <div className="order-actions-row">
                  <button
                    type="button"
                    className="order-action-button cancel"
                    onClick={() => handleCancelOrder(order.id)}
                    disabled={cancellingId === order.id}
                  >
                    {cancellingId === order.id ? 'Cancelling...' : 'Cancel Order'}
                  </button>
                </div>
              )}
            </article>
          )
        })}
      </div>
    )
  }

  return (
    <main className="profile-page modern-profile">
      <div className="orders-page-shell">
        <section className="profile-card">
          <div className="card-header">
            <h1>My Orders</h1>
            <p>Track your order history and current orders</p>
          </div>
          <div className="card-body orders-body">{renderOrdersContent()}</div>
        </section>
      </div>
    </main>
  )
}

export default OrdersPage

