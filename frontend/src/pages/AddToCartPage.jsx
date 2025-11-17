import products from '../data/products'

const cartItems = [
  { productId: 2, quantity: 2 },
  { productId: 1, quantity: 1 },
  { productId: 4, quantity: 3 },
].map((item) => {
  const product = products.find((p) => p.id === item.productId)
  return { ...item, product, subtotal: item.quantity * product.price }
})

const subtotal = cartItems.reduce((sum, item) => sum + item.subtotal, 0)
const deliveryFee = 50
const total = subtotal + deliveryFee

function AddToCartPage() {
  return (
    <main className="customer-module">
      <header className="hero">
        <p className="eyebrow">Cart experience</p>
        <h1>Add to Cart</h1>
        <p className="intro">
          Shoppers can review selected items, tweak quantities, or remove entries before committing to
          checkout. Totals recalculate instantly to keep them confident.
        </p>
      </header>

      <section className="cart-section">
        <article className="cart-table">
          <div className="cart-table__header">
            <span>Product</span>
            <span>Price</span>
            <span>Quantity</span>
            <span>Subtotal</span>
          </div>
          {cartItems.map((item) => (
            <div className="cart-row" key={item.productId}>
              <div className="cart-product">
                <img src={item.product.image} alt={item.product.name} />
                <div>
                  <p>{item.product.name}</p>
                  <small>SKU #{item.product.id}</small>
                </div>
              </div>
              <span>₱{item.product.price}</span>
              <div className="qty-pill">
                <button type="button">-</button>
                <span>{item.quantity}</span>
                <button type="button">+</button>
              </div>
              <strong>₱{item.subtotal}</strong>
            </div>
          ))}
          <button type="button" className="link-btn">
            Clear cart
          </button>
        </article>

        <aside className="cart-summary">
          <h3>Cart total</h3>
          <div>
            <span>Subtotal</span>
            <strong>₱{subtotal}</strong>
          </div>
          <div>
            <span>Delivery fee</span>
            <strong>₱{deliveryFee}</strong>
          </div>
          <div className="cart-summary__total">
            <span>Total</span>
            <strong>₱{total}</strong>
          </div>
          <button type="button" className="primary-btn">
            Proceed to checkout
          </button>
        </aside>
      </section>
    </main>
  )
}

export default AddToCartPage

