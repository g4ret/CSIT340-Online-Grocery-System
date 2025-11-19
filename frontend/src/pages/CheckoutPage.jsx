import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

const orderedProducts = [
  { productId: 1, qty: 3 },
  { productId: 3, qty: 3 },
  { productId: 4, qty: 1 },
  { productId: 2, qty: 3 },
]

function CheckoutPage({ showToast, onNavigate }) {
  const [products, setProducts] = useState([])

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

  const subtotal = orderedProducts.reduce((sum, item) => {
    const product = products.find((p) => p.id === item.productId)
    return sum + (product?.price || 0) * item.qty
  }, 0)

  const handlePlaceOrder = () => {
    if (showToast) {
      showToast('Order placed successfully. You can track it in Orders & Tracking.', 'success')
    }
    if (onNavigate) {
      onNavigate('orders')
    }
  }

  return (
    <main className="customer-module checkout-page">
      <section className="checkout-section">
        <div className="checkout-card full">
          <p className="section-eyebrow">Delivery address</p>
          <h2>Claudine Margaret Ricablanca (+63) 994 082 4135</h2>
          <p>626 Cebu South Rd., Pardo (Pob.), Cebu City, Visayas, Cebu 6000</p>
          <button type="button" className="link-btn subtle">
            Change
          </button>
        </div>

        <div className="products-card">
          <h3>Products Ordered</h3>
          <article className="merchant-block">
            <div className="merchant-title">
              Insta Threads PH <button className="link-btn subtle">Chat now</button>
            </div>
            {orderedProducts.map((item) => {
              const product = products.find((p) => p.id === item.productId)
              if (!product) {
                return null
              }
              return (
                <div className="checkout-row" key={product.id}>
                  <div className="product-cell">
                    <img src={product.image} alt={product.name} />
                    <div>
                      <p>{product.name}</p>
                      <small>Variation: {product.badge} • Qty {item.qty}</small>
                    </div>
                  </div>
                  <div>₱{product.price}</div>
                  <div>{item.qty}</div>
                  <div>₱{product.price * item.qty}</div>
                </div>
              )
            })}
          </article>
        </div>

        <div className="checkout-card">
          <h3>Shop voucher</h3>
          <button type="button" className="link-btn subtle">
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
            <button type="button" className="link-btn subtle">
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

