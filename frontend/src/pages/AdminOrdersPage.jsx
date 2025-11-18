import { useMemo, useState } from 'react'
import products from '../data/products'

const orderStatuses = ['All Orders', 'Pending', 'Packed', 'Out for delivery', 'Delivered']

const ordersData = products.map((product, index) => ({
  id: `ORD-${1020 + index}`,
  productName: product.name,
  category: product.category,
  price: product.price + index * 3,
  qty: (index + 1) * 2,
  status: ['Pending', 'Packed', 'Out for delivery', 'Delivered'][index % 4],
  badge: product.badge,
  image: product.image,
}))

function AdminOrdersPage({ onNavigate }) {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All Orders')

  const filteredOrders = useMemo(() => {
    return ordersData.filter((order) => {
      const matchesSearch = order.id.toLowerCase().includes(search.toLowerCase().trim())
      const matchesStatus = statusFilter === 'All Orders' || order.status === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [search, statusFilter])

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
            <span>Product</span>
            <span>Category</span>
            <span>Order ID</span>
            <span>Price</span>
            <span>Status</span>
            <span>Actions</span>
          </header>
          {filteredOrders.map((order) => (
            <article key={order.id}>
              <div className="product-meta">
                <img src={order.image} alt={order.productName} />
                <div>
                  <strong>{order.productName}</strong>
                  <p>{order.qty} items</p>
                </div>
              </div>
              <span>{order.category}</span>
              <span>{order.id}</span>
              <div className="price-stack">
                <strong>₱{(order.price * order.qty).toFixed(2)}</strong>
                <small className="muted">₱{(order.price * order.qty * 1.05).toFixed(2)}</small>
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

