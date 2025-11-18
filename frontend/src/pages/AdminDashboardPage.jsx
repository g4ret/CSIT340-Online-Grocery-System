const summaryCards = [
  { label: 'Products', value: '2,650', target: 'category' },
  { label: 'Orders', value: '2,650', target: 'orders' },
  { label: 'Users', value: '2,650', target: 'profile' },
]

const homeDeliveryOrders = [
  {
    customer: 'John Doe',
    address: 'Mandaue City, Cebu',
    phone: '0928372134',
    amount: 13250,
    paymentMethod: 'Gcash',
    paymentStatus: 'Paid',
  },
  {
    customer: 'Jane Doe',
    address: 'Mandaue City, Cebu',
    phone: '0928372134',
    amount: 13250,
    paymentMethod: 'Gcash',
    paymentStatus: 'Paid',
  },
]

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

function AdminDashboardPage({ onNavigate }) {
  const currencyFormatter = new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    maximumFractionDigits: 0,
  })

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
                {homeDeliveryOrders.map((order, index) => (
                  <div className="pending-table__row" key={`${order.customer}-${index}`}>
                    <span>{order.customer}</span>
                    <span>{order.address}</span>
                    <span>{order.phone}</span>
                    <span>{currencyFormatter.format(order.amount)}</span>
                    <span>{order.paymentMethod}</span>
                    <span>{order.paymentStatus}</span>
                    <span>
                      <button type="button" className="assign-btn">
                        Assign Delivery
                      </button>
                    </span>
                  </div>
                ))}
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

