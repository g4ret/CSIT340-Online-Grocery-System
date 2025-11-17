import products from '../data/products'

const merchants = [
  {
    id: 'insta-threads',
    name: 'Insta Threads PH',
    items: [
      { productId: 2, quantity: 3, variation: 'BLACK, XXL' },
      { productId: 3, quantity: 3, variation: 'WHITE, XL' },
      { productId: 1, quantity: 1, variation: 'RED, XXL' },
      { productId: 5, quantity: 1, variation: 'KHAKI, XXL' },
    ],
  },
]

const computeSubtotal = (items) =>
  items.reduce((sum, entry) => {
    const product = products.find((p) => p.id === entry.productId)
    return sum + (product?.price || 0) * entry.quantity
  }, 0)

function AddToCartPage({ onCheckout }) {
  const totalItems = merchants.reduce(
    (sum, merchant) => sum + merchant.items.reduce((count, item) => count + item.quantity, 0),
    0
  )
  const totalPrice = merchants.reduce((sum, merchant) => sum + computeSubtotal(merchant.items), 0)

  const handleCheckout = () => {
    if (onCheckout) {
      onCheckout()
    }
  }

  return (
    <main className="customer-module cart-page">

      <section className="cart-section">
        <div className="cart-head">
          <div>Product</div>
          <div>Unit price</div>
          <div>Quantity</div>
          <div>Total Price</div>
          <div>Actions</div>
        </div>

        {merchants.map((merchant) => (
          <article className="merchant-block" key={merchant.id}>
            <div className="merchant-title">
              <label>
                <input type="checkbox" /> {merchant.name}
              </label>
            </div>
            {merchant.items.map((entry) => {
              const product = products.find((p) => p.id === entry.productId)
              return (
                <div className="cart-row" key={`${merchant.id}-${entry.productId}`}>
                  <label className="product-cell">
                    <input type="checkbox" />
                    <img src={product.image} alt={product.name} />
                    <div>
                      <p>{product.name}</p>
                      <small>Variations: {entry.variation}</small>
                    </div>
                  </label>
                  <strong>₱{product.price}</strong>
                  <div className="qty-pill">
                    <button type="button">-</button>
                    <span>{entry.quantity}</span>
                    <button type="button">+</button>
                  </div>
                  <strong>₱{product.price * entry.quantity}</strong>
                  <div className="actions">
                    <button type="button" className="link-btn">
                      Delete
                    </button>
                    <button type="button" className="link-btn subtle">
                      Find similar
                    </button>
                  </div>
                </div>
              )
            })}
          </article>
        ))}
      </section>

      <footer className="cart-footer">
        <div className="bulk-actions">
          <label>
            <input type="checkbox" /> Select all ({totalItems})
          </label>
          <button type="button">Delete</button>
          <button type="button">Remove inactive products</button>
          <button type="button">Move to likes</button>
        </div>
        <div className="checkout-summary">
          <div>
            Total ({totalItems} item{totalItems > 1 ? 's' : ''}): <strong>₱{totalPrice}</strong>
          </div>
          <button type="button" className="checkout-btn" onClick={handleCheckout}>
            Check Out
          </button>
        </div>
      </footer>
    </main>
  )
}

export default AddToCartPage

