function AddToCartPage({ cartItems = [], onCheckout, showToast }) {
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = cartItems.reduce(
    (sum, item) => sum + (item.product?.price || 0) * item.quantity,
    0
  )

  const handleCheckout = () => {
    if (showToast) {
      showToast('Review your order details on the checkout page.', 'info')
    }
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

        {cartItems.length === 0 && (
          <p className="empty-cart">Your cart is empty.</p>
        )}

        {cartItems.length > 0 && (
          <article className="merchant-block" key="cart-merchant">
            <div className="merchant-title">
              <label>
                <input type="checkbox" /> LazShoppe
              </label>
            </div>
            {cartItems.map((entry) => {
              const product = entry.product

              if (!product) {
                return null
              }

              return (
                <div className="cart-row" key={entry.productId}>
                  <label className="product-cell">
                    <input type="checkbox" />
                    <img src={product.image} alt={product.name} />
                    <div>
                      <p>{product.name}</p>
                      <small>Qty: {entry.quantity}</small>
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
        )}
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

