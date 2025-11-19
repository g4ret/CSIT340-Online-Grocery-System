function CheckoutPage({ showToast, onNavigate, onOrderPlaced, checkoutItems = [] }) {
  const subtotal = checkoutItems.reduce(
    (sum, item) => sum + (item.product?.price || 0) * item.quantity,
    0
  )

  const handlePlaceOrder = () => {
    if (showToast) {
      showToast('Order placed successfully. You can track it in Orders & Tracking.', 'success')
    }
    if (onOrderPlaced) {
      onOrderPlaced()
    }
    if (onNavigate) {
      onNavigate('orders')
    }
  }

  const handleChangeAddress = () => {
    if (showToast) {
      showToast('Address editing will be available soon (demo only).', 'info')
    }
  }

  const handleSelectVoucher = () => {
    if (showToast) {
      showToast('Voucher selection will be available soon (demo only).', 'info')
    }
  }

  const handleChangePayment = () => {
    if (showToast) {
      showToast('Payment method change will be available soon (demo only).', 'info')
    }
  }

  return (
    <main className="customer-module checkout-page">
      <section className="checkout-section">
        <div className="checkout-card full">
          <p className="section-eyebrow">Delivery address</p>
          <h2>Claudine Margaret Ricablanca (+63) 994 082 4135</h2>
          <p>626 Cebu South Rd., Pardo (Pob.), Cebu City, Visayas, Cebu 6000</p>
          <button type="button" className="link-btn subtle" onClick={handleChangeAddress}>
            Change
          </button>
        </div>

        <div className="products-card">
          <h3>Products Ordered</h3>
          <article className="merchant-block">
            <div className="merchant-title">
              Insta Threads PH <button className="link-btn subtle">Chat now</button>
            </div>
            {checkoutItems.map((item) => {
              const product = item.product

              if (!product) {
                return null
              }

              return (
                <div className="checkout-row" key={item.productId}>
                  <div className="product-cell">
                    <img src={product.image} alt={product.name} />
                    <div>
                      <p>{product.name}</p>
                      <small>
                        Variation: {product.badge} • Qty {item.quantity}
                      </small>
                    </div>
                  </div>
                  <div>₱{product.price}</div>
                  <div>{item.quantity}</div>
                  <div>₱{product.price * item.quantity}</div>
                </div>
              )
            })}
          </article>
        </div>

        <div className="checkout-card">
          <h3>Shop voucher</h3>
          <button type="button" className="link-btn subtle" onClick={handleSelectVoucher}>
            Select Voucher
          </button>
        </div>

        <div className="checkout-card">
          <h3>Shopee Coins</h3>
          <small>Coins cannot be redeemed</small>
        </div>

        <div className="payment-summary">
          <div>
            <h3>Payment Method</h3>
            <p>Cash on Delivery</p>
            <button type="button" className="link-btn subtle" onClick={handleChangePayment}>
              Change
            </button>
          </div>
          <div className="totals">
            <div>
              <span>Merchandise Subtotal</span>
              <strong>₱{subtotal}</strong>
            </div>
            <div>
              <span>Shipping Subtotal</span>
              <strong>₱175</strong>
            </div>
            <div className="checkout-summary__total">
              <span>Total Payment</span>
              <strong>₱{subtotal + 175}</strong>
            </div>
          </div>
          <button type="button" className="checkout-btn wide" onClick={handlePlaceOrder}>
            Place Order
          </button>
        </div>
      </section>
    </main>
  )
}

export default CheckoutPage

