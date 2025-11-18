const product = {
  name: 'Ligo Easy Open Can Sardines In Tomato Sauce 155g',
  packPrice: '₱142.50 (6pcs)',
  srp: '₱150.00',
  featuredPrice: '₱285.00',
  variants: [
    { id: 'tomato', label: 'Tomato', color: '#d8342f' },
    { id: 'spanish', label: 'Spanish', color: '#4a6fa5' },
  ],
  sizes: ['1', '2'],
  image: '/assets/products/lucky-mega.png',
}

const relatedProducts = [
  {
    id: 'rel-1',
    name: 'Ligo Easy Open Can Sardines in Tomato Sauce 155g',
    price: '₱142.50 (6pcs)',
    oldPrice: '₱150.00',
    discount: '-5%',
    qtyLabel: '6 pcs',
    image: '/assets/products/lucky-mega.png',
  },
  {
    id: 'rel-2',
    name: 'Ligo Easy Open Can Sardines in Tomato Sauce 155g',
    price: '₱142.50 (6pcs)',
    oldPrice: '₱150.00',
    discount: '-5%',
    qtyLabel: '6 pcs',
    image: '/assets/products/lucky-mega.png',
  },
  {
    id: 'rel-3',
    name: 'Ligo Easy Open Can Sardines in Tomato Sauce 155g',
    price: '₱142.50 (6pcs)',
    oldPrice: '₱150.00',
    discount: '-5%',
    qtyLabel: '8 pcs',
    image: '/assets/products/lucky-mega.png',
  },
  {
    id: 'rel-4',
    name: 'Ligo Easy Open Can Sardines in Tomato Sauce 155g',
    price: '₱142.50 (6pcs)',
    oldPrice: '₱150.00',
    discount: '-5%',
    qtyLabel: '8 pcs',
    image: '/assets/products/lucky-mega.png',
  },
  {
    id: 'rel-5',
    name: 'Ligo Easy Open Can Sardines in Tomato Sauce 155g',
    price: '₱142.50 (6pcs)',
    oldPrice: '₱150.00',
    discount: '-5%',
    qtyLabel: '6 pcs',
    image: '/assets/products/lucky-mega.png',
  },
]

function ProductDetailsPage() {
  return (
    <main className="product-details-page">
      <div className="product-details-shell">
        <nav className="product-breadcrumbs">
          <a href="/">Home</a>
          <span>/</span>
          <a href="/">Pantry Essentials</a>
          <span>/</span>
          <a href="/">Canned Goods</a>
          <span>/</span>
          <span>Canned Seafood</span>
        </nav>

        <section className="product-summary-card">
          <div className="product-summary__media">
            <img src={product.image} alt={product.name} />
          </div>

          <div className="product-summary__info">
            <h1>{product.name}</h1>
            <p className="product-sub-price">
              {product.packPrice} <span>{product.srp}</span>
            </p>

            <div className="product-variants">
              <div>
                <span>Variants:</span>
                <div className="variant-swatches">
                  {product.variants.map((variant) => (
                    <button
                      key={variant.id}
                      type="button"
                      className="variant-swatch"
                      style={{ backgroundColor: variant.color }}
                    >
                      <span className="sr-only">{variant.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <span>Size:</span>
                <div className="size-selector">
                  {product.sizes.map((size, idx) => (
                    <button key={size} type="button" className={`size-pill ${idx === 0 ? 'active' : ''}`}>
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="product-featured-price">{product.featuredPrice}</div>

            <div className="product-quantity">
              <button type="button" aria-label="Decrease quantity">
                -
              </button>
              <span>2</span>
              <button type="button" aria-label="Increase quantity">
                +
              </button>
            </div>

            <button type="button" className="product-add-to-cart">
              Add to Cart
            </button>

            <div className="product-meta-actions">
              <button type="button">❤</button>
              <button type="button">⤴</button>
            </div>
          </div>
        </section>

        <section className="product-related">
          <div className="product-related__header">
            <span>Related Products</span>
          </div>

          <div className="product-related__grid">
            {relatedProducts.map((item) => (
              <article className="related-card" key={item.id}>
                <div className="related-card__badge">{item.discount}</div>
                <button type="button" className="related-card__fav" aria-label="Add to wishlist">
                  ❤
                </button>
                <div className="related-card__media">
                  <img src={item.image} alt={item.name} loading="lazy" />
                </div>
                <p className="related-card__qty">{item.qtyLabel}</p>
                <p className="related-card__name">{item.name}</p>
                <p className="related-card__price">
                  <strong>{item.price}</strong> <span>{item.oldPrice}</span>
                </p>
                <button type="button" className="related-card__cta">
                  Add to Cart
                </button>
              </article>
            ))}
          </div>
        </section>
      </div>

    </main>
  )
}

export default ProductDetailsPage

