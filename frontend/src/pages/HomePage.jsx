import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

const categories = [
  { icon: '🥫', label: 'Pantry Essentials', count: 1 },
  { icon: '🥐', label: 'Breakfast World', count: 1 },
  { icon: '🍷', label: 'Wines & Liquors', count: 1 },
  { icon: '🥬', label: 'Fruits & Vegetables', count: 12 },
  { icon: '🍳', label: 'Lifestyle Cooking', count: 1 },
  { icon: '🍬', label: 'Snacks & Sweets', count: 1 },
  { icon: '💄', label: 'Health & Beauty', count: 1 },
  { icon: '🍗', label: 'Meats, Frozen & Seafood', count: 2 },
]

const perks = [
  {
    icon: '🚚',
    title: 'Free & Next Day Delivery',
    detail: 'Free delivery for all orders over ₱140',
  },
  {
    icon: '✅',
    title: '100% Satisfaction Guarantee',
    detail: 'We return money within 30 days',
  },
  {
    icon: '🏷️',
    title: 'Great Daily Deals Discount',
    detail: 'Save up to 50% on selected items',
  },
]

// Calculate discount percentage
const calculateDiscount = (originalPrice, currentPrice) => {
  return Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
}

function HomePage({ onNavigate, onAddToCart, showToast }) {
  const [products, setProducts] = useState([])
  const [quantities, setQuantities] = useState({})

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase.from('products').select('*')

      if (error) {
        console.error('Error loading products from Supabase', error)
      } else {
        setProducts(data)
      }
    }

    fetchProducts()
  }, [])

  const goToProductDetails = () => {
    if (onNavigate) {
      onNavigate('product')
    }
  }

  const handleKeyNavigate = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      goToProductDetails()
    }
  }

  const getQuantity = (productId) => quantities[productId] || 1

  const handleQuantityChange = (productId, delta) => {
    setQuantities((previous) => {
      const current = previous[productId] || 1
      const next = Math.max(1, current + delta)
      return { ...previous, [productId]: next }
    })
  }

  const handleAddToCartWithQuantity = (product) => {
    if (!onAddToCart) return

    const quantity = quantities[product.id] || 1
    onAddToCart(product, quantity)
  }

  const handleShopNow = () => {
    if (onNavigate) {
      onNavigate('category')
    }
    if (showToast) {
      showToast('Browsing more products in Categories.', 'info')
    }
  }

  const handleViewAll = () => {
    if (onNavigate) {
      onNavigate('category')
    }
  }

  const topSavers = products.slice(0, 8).map((product) => {
    const originalPrice = product.price + Math.floor(product.price * 0.2)
    const discount = calculateDiscount(originalPrice, product.price)
    return { ...product, originalPrice, discount }
  })

  return (
    <main className="home-screen">
      <section className="hero-banner-groci">
        <div className="hero-left">
          <h1>
            <span className="hero-orange">100% Natural</span>
            <br />
            Quality & Freshness Guaranteed! Good Health.
          </h1>
          <button type="button" className="shop-now-btn green" onClick={handleShopNow}>
            SHOP NOW
          </button>
        </div>
        <div className="hero-right">
          <h1>
            <span className="hero-orange">Fresh</span> <span className="hero-green">Vegetables</span>
          </h1>
          <button type="button" className="shop-now-btn orange" onClick={handleShopNow}>
            SHOP NOW
          </button>
        </div>
      </section>

      <section className="home-section">
        <div className="section-top">
          <div>
            <h2>Top Savers Today</h2>
            <span className="discount-badge">20% OFF</span>
          </div>
          <button type="button" className="view-all-link" onClick={handleViewAll}>
            View All
          </button>
        </div>
        <div className="card-grid">
          {topSavers.map((product) => (
            <article className="home-product-card" key={product.id}>
              <span className="discount-pill">{product.discount}%</span>
              <div className="product-organic-badge">●</div>
              <img
                src={product.image}
                alt={product.name}
                loading="lazy"
                onClick={goToProductDetails}
                className="product-thumb"
              />
              <h3 onClick={goToProductDetails} role="link" tabIndex={0} onKeyDown={handleKeyNavigate}>
                {product.name}
              </h3>
              <div className="stock-status">
                <span className="checkmark">✓</span> In Stock - 1 {product.unit}
              </div>
              <div className="price-row">
                <strong>₱{product.price}</strong>
                <span className="old-price">₱{product.originalPrice}</span>
              </div>
              <div className="quantity-selector">
                <button
                  type="button"
                  onClick={() => handleQuantityChange(product.id, -1)}
                >
                  -
                </button>
                <span>{getQuantity(product.id)}</span>
                <button
                  type="button"
                  onClick={() => handleQuantityChange(product.id, 1)}
                >
                  +
                </button>
              </div>
              <button type="button" className="view-details-btn" onClick={goToProductDetails}>
                View Details
              </button>
              <button
                type="button"
                className="add-cart-btn"
                onClick={() => handleAddToCartWithQuantity(product)}
              >
                🛒 Add to cart
              </button>
            </article>
          ))}
        </div>
      </section>

      <section className="home-section">
        <div className="section-top">
          <div>
            <p className="section-eyebrow">Best Offers View</p>
            <span className="discount-badge">20% OFF</span>
          </div>
          <button type="button" className="view-all-link" onClick={handleViewAll}>
            View All
          </button>
        </div>
        <div className="card-grid">
          {topSavers.slice(0, 5).map((product) => (
            <article className="home-product-card" key={product.id}>
              <span className="discount-pill">{product.discount}%</span>
              <div className="product-organic-badge">●</div>
              <img
                src={product.image}
                alt={product.name}
                loading="lazy"
                onClick={goToProductDetails}
                className="product-thumb"
              />
              <h3 onClick={goToProductDetails} role="link" tabIndex={0} onKeyDown={handleKeyNavigate}>
                {product.name}
              </h3>
              <div className="stock-status">
                <span className="checkmark">✓</span> In Stock - 1 {product.unit}
              </div>
              <div className="price-row">
                <strong>₱{product.price}</strong>
                <span className="old-price">₱{product.originalPrice}</span>
              </div>
              <div className="quantity-selector">
                <button type="button">-</button>
                <span>1</span>
                <button type="button">+</button>
              </div>
              <button type="button" className="view-details-btn" onClick={goToProductDetails}>
                View Details
              </button>
              <button
                type="button"
                className="add-cart-btn"
                onClick={() => onAddToCart && onAddToCart(product)}
              >
                🛒 Add to cart
              </button>
            </article>
          ))}
        </div>
      </section>

      <section className="home-section categories-block">
        <p className="section-eyebrow">Categories</p>
        <h2>Browse By Category</h2>
        <div className="category-grid">
          {categories.map((category) => (
            <article key={category.label} className="icon-card">
              <span className="icon">{category.icon}</span>
              <p>{category.label}</p>
              <span className="item-count">{category.count} Items</span>
            </article>
          ))}
        </div>
      </section>

      <section className="home-section perks-section">
        <div className="perks-row">
          {perks.map((perk) => (
            <article key={perk.title} className="perk-card">
              <div className="perk-icon-circle">
                <span>{perk.icon}</span>
              </div>
              <h4>{perk.title}</h4>
              <p>{perk.detail}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}

export default HomePage

