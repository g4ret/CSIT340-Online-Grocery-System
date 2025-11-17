import products from '../data/products'

const categories = [
  { icon: '🥫', label: 'Pantry Essentials', active: false },
  { icon: '🥐', label: 'Breakfast World', active: false },
  { icon: '🍷', label: 'Wines & Liquors', active: false },
  { icon: '🍳', label: 'Lifestyle Cooking', active: true },
  { icon: '🍬', label: 'Snacks & Sweets', active: false },
  { icon: '💄', label: 'Health & Beauty', active: false },
]

const perks = [
  {
    title: 'Free and fast delivery',
    detail: 'Free delivery for all orders over ₱140',
  },
  {
    title: '24/7 customer service',
    detail: 'Friendly support whenever you need it',
  },
  {
    title: 'Money back guarantee',
    detail: 'We return money within 30 days',
  },
]

function HomePage() {
  const bestSellers = products.slice(0, 6)
  const exploreProducts = products
  const heroProduct = products[2]

  return (
    <main className="home-screen">
      <section className="hero-banner">
        <div className="hero-content">
          <p className="eyebrow">Fresh groceries • Delivered fast</p>
          <h1>Shop smart, eat fresh, repeat weekly.</h1>
          <p>
            Discover curated staples, trending finds, and essentials from trusted suppliers. Track
            orders, manage profiles, and keep the pantry stocked without leaving home.
          </p>
          <div className="hero-cta">
            <button type="button" className="primary-btn large">
              Start shopping
            </button>
            <button type="button" className="secondary-btn">
              Today&apos;s deals
            </button>
          </div>
          <div className="hero-stats">
            <div>
              <strong>500+</strong>
              <span>Weekly picks</span>
            </div>
            <div>
              <strong>45 mins</strong>
              <span>Average delivery</span>
            </div>
            <div>
              <strong>4.9/5</strong>
              <span>Customer rating</span>
            </div>
          </div>
        </div>
        <div className="hero-card">
          <p className="section-eyebrow">Weekly highlight</p>
          <h3>{heroProduct.name}</h3>
          <p>{heroProduct.description}</p>
          <img src={heroProduct.image} alt={heroProduct.name} />
          <div className="price-row">
            <strong>₱{heroProduct.price}</strong>
            <span className="old-price">₱{heroProduct.price + 20}</span>
          </div>
          <button type="button" className="primary-btn wide">
            Add To Cart
          </button>
        </div>
      </section>

      <section className="home-section">
        <div className="section-top">
          <div>
            <p className="section-eyebrow">This Month</p>
            <h2>Best Selling Products</h2>
          </div>
          <button type="button" className="ghost-btn">
            View All
          </button>
        </div>
        <div className="card-grid">
          {bestSellers.map((product) => (
            <article className="home-product-card" key={product.id}>
              <span className="discount-pill">-5%</span>
              <div className="product-actions">
                <button type="button" aria-label="favorite">
                  ♡
                </button>
                <button type="button" aria-label="view product">
                  👁
                </button>
              </div>
              <img src={product.image} alt={product.name} loading="lazy" />
              <p className="stock-count">6 pcs</p>
              <h3>{product.name}</h3>
              <div className="price-row">
                <strong>₱142.50 (5pcs)</strong>
                <span className="old-price">₱{product.price + 7.5}</span>
              </div>
              <button type="button" className="primary-btn wide">
                Add To Cart
              </button>
            </article>
          ))}
        </div>
      </section>

      <section className="home-section">
        <div className="section-top">
          <div>
            <p className="section-eyebrow">Our Products</p>
            <h2>Explore Our Products</h2>
          </div>
          <button type="button" className="ghost-btn">
            View All Products
          </button>
        </div>
        <div className="card-grid">
          {exploreProducts.map((product) => (
            <article className="home-product-card" key={product.id}>
              <span className="discount-pill">-5%</span>
              <div className="product-actions">
                <button type="button" aria-label="favorite">
                  ♡
                </button>
                <button type="button" aria-label="view product">
                  👁
                </button>
              </div>
              <img src={product.image} alt={product.name} loading="lazy" />
              <p className="stock-count">6 pcs</p>
              <h3>{product.name}</h3>
              <div className="price-row">
                <strong>₱142.50 (5pcs)</strong>
                <span className="old-price">₱{product.price + 7.5}</span>
              </div>
              <button type="button" className="primary-btn wide">
                Add To Cart
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
            <article
              key={category.label}
              className={`icon-card ${category.active ? 'active' : ''}`}
            >
              <span className="icon">{category.icon}</span>
              <p>{category.label}</p>
            </article>
          ))}
        </div>

        <div className="perks-row">
          {perks.map((perk) => (
            <article key={perk.title}>
              <span className="perk-icon">●</span>
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

