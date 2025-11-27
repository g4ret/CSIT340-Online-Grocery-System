import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

const pickupOrders = [
  { customer: 'Felix Ramos', schedule: '11:00 AM', amount: 8450, status: 'Ready' },
  { customer: 'Anya Lira', schedule: '1:30 PM', amount: 4250, status: 'Packing' },
]

const activeDelivery = {
  rider: 'James Bond',
  orderId: 'ORD-1050',
  distance: '4.2 km away',
  status: 'In transit',
}

function AdminDashboardPage({ onNavigate, showToast }) {
  const [productCount, setProductCount] = useState(0)
  const [orderCount, setOrderCount] = useState(0)
  const [userCount, setUserCount] = useState(0)
  const [pendingOrders, setPendingOrders] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const currencyFormatter = new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    maximumFractionDigits: 0,
  })

  const loadDashboardData = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const [productsResult, ordersResult, usersResult] = await Promise.all([
        supabase.from('products').select('*', { count: 'exact', head: true }),
        supabase.from('orders').select('*', { count: 'exact', head: true }),
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
      ])

      if (!productsResult.error && typeof productsResult.count === 'number') {
        setProductCount(productsResult.count)
      } else if (productsResult.error) {
        console.error('Error counting products', productsResult.error)
      }

      if (!ordersResult.error && typeof ordersResult.count === 'number') {
        setOrderCount(ordersResult.count)
      } else if (ordersResult.error) {
        console.error('Error counting orders', ordersResult.error)
      }

      if (!usersResult.error && typeof usersResult.count === 'number') {
        setUserCount(usersResult.count)
      } else if (usersResult.error) {
        console.error('Error counting users', usersResult.error)
      }

      const { data: ordersData, error: pendingError } = await supabase
        .from('orders')
        .select('*')
        .in('status', ['Pending', 'Packed', 'Out for delivery'])
        .order('created_at', { ascending: false })
        .limit(5)

      if (pendingError) {
        console.error('Error loading pending orders for dashboard', pendingError)
        setError('Failed to load pending orders.')
        setPendingOrders([])
      } else {
        const userIds = Array.from(new Set((ordersData || []).map((order) => order.user_id).filter(Boolean)))
        let profilesById = {}

        if (userIds.length) {
          const { data: profilesData, error: profilesError } = await supabase
            .from('profiles')
            .select('id, full_name, address, phone')
            .in('id', userIds)

          if (profilesError) {
            console.error('Error loading profiles for dashboard', profilesError)
          } else {
            profilesById = (profilesData || []).reduce((acc, profile) => {
              acc[profile.id] = profile
              return acc
            }, {})
          }
        }

        const mapped = (ordersData || []).map((order) => {
          const profile = profilesById[order.user_id] || {}
          const status = order.status || 'Pending'

          const paymentStatus = status === 'Delivered' ? 'Paid' : 'Unpaid'

          return {
            id: order.id,
            orderNumber: order.order_number,
            status,
            amount: Number(order.total_amount) || 0,
            customerName: profile.full_name || '—',
            address: profile.address || '—',
            phone: profile.phone || '—',
            paymentMethod: 'Cash on Delivery',
            paymentStatus,
          }
        })

        setPendingOrders(mapped)
      }
    } catch (err) {
      console.error('Unexpected error loading dashboard data', err)
      setError('Failed to load dashboard data.')
      setPendingOrders([])
      if (showToast) {
        showToast('Failed to load dashboard data. Please try again.', 'error')
      }
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadDashboardData()
  }, [])

  const summaryCards = [
    { label: 'Products', value: productCount.toLocaleString(), target: 'adminProducts' },
    { label: 'Orders', value: orderCount.toLocaleString(), target: 'adminOrders' },
    { label: 'Users', value: userCount.toLocaleString(), target: 'adminUsers' },
  ]

  return (
    <main className="admin-dashboard-simple">
      <div className="admin-board">
        <header className="admin-page-header">
          <h1>Dashboard</h1>
        </header>
        <section className="admin-board__summary">
          {summaryCards.map((card) => (
            <article key={card.label} className="summary-card">
              <p>{card.label}</p>
              <strong>{card.value}</strong>
              <button type="button" onClick={() => onNavigate?.(card.target)}>
                View &gt;
              </button>
            </article>
          ))}
        </section>

        <section className="admin-board__pending">
          <div className="pending-left">
            <h2>Pending Orders</h2>

            <article className="pending-card">
              <div className="pending-card__header">
                <h3>Home Delivery</h3>
              </div>
              <div className="pending-table">
                <div className="pending-table__head">
                  <span>Customer</span>
                  <span>Address</span>
                  <span>Phone</span>
                  <span>Order Amount</span>
                  <span>Payment Method</span>
                  <span>Payment Status</span>
                  <span />
                </div>
                {isLoading ? (
                  <p>Loading pending orders...</p>
                ) : error ? (
                  <p>{error}</p>
                ) : pendingOrders.length === 0 ? (
                  <p>No pending or in-progress orders at the moment.</p>
                ) : (
                  pendingOrders.map((order) => (
                    <div className="pending-table__row" key={order.id}>
                      <span>{order.customerName}</span>
                      <span>{order.address}</span>
                      <span>{order.phone}</span>
                      <span>{currencyFormatter.format(order.amount)}</span>
                      <span>{order.paymentMethod}</span>
                      <span>{order.paymentStatus}</span>
                      <span>
                        <button
                          type="button"
                          className="assign-btn"
                          onClick={() => onNavigate && onNavigate('adminOrders')}
                        >
                          View
                        </button>
                      </span>
                    </div>
                  ))
                )}
              </div>
            </article>

            <article className="pending-card">
              <div className="pending-card__header">
                <h3>Personal Pickups</h3>
              </div>
              <div className="pickup-list">
                {pickupOrders.map((order) => (
                  <div key={order.customer} className="pickup-row">
                    <div>
                      <strong>{order.customer}</strong>
                      <p>{order.status}</p>
                    </div>
                    <div>
                      <span>{order.schedule}</span>
                      <span>{currencyFormatter.format(order.amount)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </article>
          </div>

          <aside className="pending-right">
            <h2>Active Delivery</h2>
            <div className="active-card">
              <p className="active-label">{activeDelivery.status}</p>
              <strong>{activeDelivery.rider}</strong>
              <p>{activeDelivery.orderId}</p>
              <span>{activeDelivery.distance}</span>
            </div>
          </aside>
        </section>
      </div>
    </main>
  )
}

export default AdminDashboardPage

