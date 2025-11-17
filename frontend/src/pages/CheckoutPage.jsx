const orderedProducts = [
  { name: 'Local Oranges', price: 35, qty: 2 },
  { name: 'Corned Beef', price: 95, qty: 1 },
  { name: 'Cheddar Cheese', price: 120, qty: 1 },
]

const subtotal = orderedProducts.reduce((sum, item) => sum + item.price * item.qty, 0)

function CheckoutPage() {
  return (
    <main className="customer-module">
      <header className="hero">
        <p className="eyebrow">Checkout</p>
        <h1>Review and complete your order</h1>
        <p className="intro">
          The checkout wizard captures delivery addresses, payment preferences, and shows a final
          review before placing the order.
        </p>
      </header>

      <section className="checkout-layout">
        <form className="checkout-card">
          <h3>Delivery address</h3>
          <label>
            Full name
            <input defaultValue="Rica Blanca" />
          </label>
          <label>
            Street / apartment
            <input defaultValue="12A Mango St., West Fairview" />
          </label>
          <div className="form-grid">
            <label>
              City
              <input defaultValue="Quezon City" />
            </label>
            <label>
              Postal code
              <input defaultValue="1127" />
            </label>
          </div>
          <label>
            Phone
            <input defaultValue="+63 917 000 0000" />
          </label>
          <label>
            Delivery instructions
            <textarea placeholder="e.g. Leave with the guard, call upon arrival" />
          </label>

          <h3>Payment</h3>
          <div className="radio-list">
            <label>
              <input type="radio" name="payment" defaultChecked /> Gcash ending in 1298
            </label>
            <label>
              <input type="radio" name="payment" /> Credit card ending in 4401
            </label>
            <label>
              <input type="radio" name="payment" /> Cash on Delivery
            </label>
          </div>
        </form>

        <aside className="checkout-summary">
          <h3>Products ordered</h3>
          <ul>
            {orderedProducts.map((item) => (
              <li key={item.name}>
                <div>
                  <strong>{item.name}</strong>
                  <small>{item.qty} item{item.qty > 1 ? 's' : ''}</small>
                </div>
                <span>₱{item.price * item.qty}</span>
              </li>
            ))}
          </ul>
          <div>
            <span>Subtotal</span>
            <strong>₱{subtotal}</strong>
          </div>
          <div>
            <span>Delivery</span>
            <strong>₱50</strong>
          </div>
          <div className="checkout-summary__total">
            <span>Total</span>
            <strong>₱{subtotal + 50}</strong>
          </div>
          <button type="button" className="primary-btn">
            Place order
          </button>
        </aside>
      </section>
    </main>
  )
}

export default CheckoutPage

