import products from '../data/products'

const featuredProduct = products[1]
const relatedProducts = products.filter((p) => p.id !== featuredProduct.id).slice(0, 4)

function ProductDetailsPage() {
  return (
    <main className="customer-module">
      <header className="hero">
        <p className="eyebrow">View product details</p>
        <h1>{featuredProduct.name}</h1>
        <p className="intro">{featuredProduct.description}</p>
      </header>

      <section className="product-detail">
        <img src={featuredProduct.image} alt={featuredProduct.name} />
        <div className="product-detail__info">
          <div className="product-detail__price">
            <span>₱{featuredProduct.price}</span>
            <small>per {featuredProduct.unit}</small>
          </div>
          <p>
            Rich product information allows shoppers to evaluate quality and delivery timelines. Stock
            insights let them know how fast they need to act (currently {featuredProduct.inventory} in inventory).
          </p>
          <div className="quantity-selector">
            <span>Quantity</span>
            <div>
              <button type="button">-</button>
              <input type="number" min="1" defaultValue={1} />
              <button type="button">+</button>
            </div>
          </div>
          <button type="button" className="primary-btn">
            Add to Cart
          </button>
        </div>
      </section>

      <section>
        <div className="section-heading">
          <h2>Related Products</h2>
        </div>
        <div className="product-grid">
          {relatedProducts.map((product) => (
            <article className="product-card" key={product.id}>
              <div className="product-badge">{product.badge}</div>
              <img src={product.image} alt={product.name} loading='lazy' />
              <h3>{product.name}</h3>
              <div className="product-card__footer">
                <div>
                  <strong>₱{product.price}</strong>
                  <span> / {product.unit}</span>
                </div>
                <button type="button">Add to Cart</button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}

export default ProductDetailsPage

