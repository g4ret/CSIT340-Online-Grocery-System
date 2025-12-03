import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

const trackingSteps = [
  {
    title: 'Order Confirmation',
    detail: 'Email and SMS confirmations sent to the customer.',
    time: '10:14 AM',
    status: 'done',
  },
  {
    title: 'Packed',
    detail: 'Personal shopper prepares the basket and verifies quantities.',
    time: '11:02 AM',
    status: 'done',
  },
  {
    title: 'Out for Delivery',
    detail: 'Courier picked up the package and is en route.',
    time: '12:30 PM',
    status: 'active',
  },
  {
    title: 'Delivered',
    detail: 'Awaiting customer confirmation and rating.',
    status: 'pending',
  },
]

const profileActions = [
  'Update addresses and delivery instructions',
  'Store multiple payment methods securely',
  'Review past orders & reorder favourites',
  'Adjust notification preferences',
]

function OrdersPage() {
  const [latestOrder, setLatestOrder] = useState(null)
  const [orders, setOrders] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [profileAddress, setProfileAddress] = useState(null)

  useEffect(() => {
    const loadLatestOrder = async () => {
      setIsLoading(true)
      setError(null)

      const { data: userResult, error: userError } = await supabase.auth.getUser()

      if (userError || !userResult?.user) {
        setLatestOrder(null)
        setIsLoading(false)
        return
      }

      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', userResult.user.id)
        .order('created_at', { ascending: false })

      if (ordersError) {
        console.error('Error loading orders from Supabase', ordersError)
        setError('Failed to load your orders.')
        setLatestOrder(null)
        setOrders([])
      } else {
        setOrders(ordersData || [])
        setLatestOrder(ordersData?.[0] || null)
      }

      try {
        const user = userResult.user

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
        console.error('Unexpected error loading profile for orders page', err)
      }

      setIsLoading(false)
    }

    loadLatestOrder()
  }, [])

  const formatCurrency = (value) => {
    const numeric = typeof value === 'number' ? value : Number(value)
    if (!Number.isFinite(numeric)) return '0.00'
    return numeric.toFixed(2)
  }

  const orderNumber = latestOrder?.order_number || '#No-orders-yet'
  const paymentAmount = latestOrder ? formatCurrency(latestOrder.total_amount) : '0.00'
  const eta = latestOrder ? 'Today, 2:00 - 4:00 PM' : 'No active orders yet.'

  const trackingStatus = latestOrder?.status || null

  const computedTrackingSteps = trackingSteps.map((step, index) => {
    let status = 'pending'

    if (!trackingStatus) {
      status = 'pending'
    } else if (trackingStatus === 'Pending') {
      status = index === 0 ? 'active' : 'pending'
    } else if (trackingStatus === 'Packed') {
      status = index === 0 ? 'done' : index === 1 ? 'active' : 'pending'
    } else if (trackingStatus === 'Out for delivery') {
      status = index <= 1 ? 'done' : index === 2 ? 'active' : 'pending'
    } else if (trackingStatus === 'Delivered') {
      status = index <= 2 ? 'done' : 'done'
    } else if (trackingStatus === 'Cancelled') {
      status = 'pending'
    } else {
      status = step.status || 'pending'
    }

    return { ...step, status }
  })

  return (
    <main className="customer-module">
      <header className="hero">
        <p className="eyebrow">Orders & tracking</p>
        <h1>Keep customers informed</h1>
        <p className="intro">
          After checkout, buyers receive confirmations, can monitor courier progress, and manage their
          profile for the next purchase.
        </p>
      </header>

      <section className="order-section">
        <article className="order-card">
          <div className="order-card__header">
            <div>
              <p>Order number</p>
              <strong>{orderNumber}</strong>
            </div>
            <span className="badge">{latestOrder ? latestOrder.status || 'Paid' : 'No orders'}</span>
          </div>
          <div className="order-card__grid">
            <div>
              <h4>Delivery Address</h4>
              {profileAddress ? (
                <>
                  <p>{profileAddress.name}</p>
                  {profileAddress.address && <p>{profileAddress.address}</p>}
                  {profileAddress.phone && <p>Contact: {profileAddress.phone}</p>}
                </>
              ) : (
                <p>Please set your default delivery address in your Profile.</p>
              )}
            </div>
            <div>
              <h4>Payment</h4>
              <p>Cash on Delivery</p>
              <p>₱{paymentAmount}</p>
            </div>
            <div>
              <h4>ETA</h4>
              <p>{eta}</p>
              <small>Tracking link shared via SMS</small>
            </div>
          </div>
        </article>

        <article className="order-tracking">
          <h3>Track order</h3>
          <div className="timeline">
            {computedTrackingSteps.map((step) => (
              <div className={`timeline-step ${step.status}`} key={step.title}>
                <div className="timeline-dot" />
                <div>
                  <strong>{step.title}</strong>
                  <p>{step.detail}</p>
                  {step.time && <small>{step.time}</small>}
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="profile-card">
          <h3>Profile management</h3>
          <p>
            A dedicated profile area empowers customers to keep their data accurate and reorder in a
            click.
          </p>
          <ul>
            {profileActions.map((action) => (
              <li key={action}>{action}</li>
            ))}
          </ul>
        </article>
      </section>
    </main>
  )
}

export default OrdersPage

