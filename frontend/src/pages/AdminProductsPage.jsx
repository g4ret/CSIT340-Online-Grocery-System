import { useMemo, useState } from 'react'
import products from '../data/products'

const filterOptions = ['All Categories', ...new Set(products.map((item) => item.category))]

function AdminProductsPage({ onNavigate }) {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All Categories')

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase().trim())
      const matchesCategory = category === 'All Categories' || product.category === category
      return matchesSearch && matchesCategory
    })
  }, [search, category])

  const handleAddProduct = () => {
    alert('Add product flow will be connected to backend soon.')
  }

  return (
    <main className="admin-products">
      <div className="admin-products__shell">
        <header className="admin-page-header">
          <h1>Products</h1>
        </header>
        <section className="admin-products__controls">
          <div>
            <h2>All Products {filteredProducts.length.toLocaleString()}</h2>
          </div>
          <div className="control-row">
            <input
              type="search"
              placeholder="Search Products..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
            <select value={category} onChange={(event) => setCategory(event.target.value)}>
              {filterOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <button type="button" onClick={() => setSearch('')}>
              Refresh
            </button>
            <button type="button" className="primary" onClick={handleAddProduct}>
              + Add Product
            </button>
          </div>
        </section>

        <section className="admin-products__table">
          <header>
            <span>Product</span>
            <span>Category</span>
            <span>Price</span>
            <span>Stock</span>
            <span>Status</span>
            <span>Actions</span>
          </header>
          {filteredProducts.map((product) => (
            <article key={product.id}>
              <div className="product-meta">
                <img src={product.image} alt={product.name} />
                <div>
                  <strong>{product.name}</strong>
                  <p>id #{product.id}</p>
                </div>
              </div>
              <span>{product.category}</span>
              <div className="price-stack">
                <strong>₱{product.price.toFixed(2)}</strong>
                <small className="muted">₱{(product.price * 1.2).toFixed(2)}</small>
              </div>
              <span className="stock-pill">{product.inventory} in stock</span>
              <span className="status-pill">{product.badge}</span>
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

export default AdminProductsPage

