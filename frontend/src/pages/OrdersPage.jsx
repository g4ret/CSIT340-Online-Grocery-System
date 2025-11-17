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
  const orderNumber = '#OGS-2025-00082'
  const eta = 'Today, 2:00 - 4:00 PM'

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
            <span className="badge">Paid</span>
          </div>
          <div className="order-card__grid">
            <div>
              <h4>Delivery Address</h4>
              <p>Rica Blanca</p>
              <p>12A Mango St., Quezon City, Metro Manila</p>
              <p>Contact: +63 917 000 0000</p>
            </div>
            <div>
              <h4>Payment</h4>
              <p>Gcash •••• 1298</p>
              <p>₱615.00</p>
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
            {trackingSteps.map((step) => (
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

