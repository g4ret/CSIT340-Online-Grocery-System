import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

function AddToCartPage({
  cartItems = [],
  onCheckout,
  showToast,
  onUpdateCartQuantity,
  onRemoveCartItems,
}) {
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0)
  const subtotal = cartItems.reduce(
    (sum, item) => sum + (item.product?.price || 0) * item.quantity,
    0
  )

  const handleQuantityChange = (productId, delta) => {
    if (onUpdateCartQuantity) {
      onUpdateCartQuantity(productId, delta)
    }
  }

  const handleRowDelete = (productId) => {
    if (onRemoveCartItems) {
      onRemoveCartItems([productId])
    }
    if (showToast) {
      showToast('Item removed from cart.', 'info')
    }
  }

  const handleCheckout = () => {
    if (!cartItems.length) {
      if (showToast) {
        showToast('Your cart is empty.', 'info')
      }
      return
    }

    if (showToast) {
      showToast('Review your order details on the checkout page.', 'info')
    }
    if (onCheckout) {
      onCheckout(cartItems.map((item) => item.productId))
    }
  }

  return (
    <main className="cart-layout">
      <div className="cart-breadcrumb">
        <span>Home</span> <span className="crumb-divider">/</span> <span>Cart</span>
      </div>

      <div className="cart-shell">
        <section className="cart-card table-card">
          <header className="cart-card__head">
            <div>Product</div>
            <div>Price</div>
            <div>Quantity</div>
            <div>Subtotal</div>
          </header>

          <div className="cart-table-body">
            {cartItems.length === 0 && <p className="empty-cart">Your cart is empty.</p>}

            {cartItems.map((entry) => {
              const product = entry.product
              if (!product) return null
              const lineTotal = (product.price || 0) * entry.quantity

              return (
                <div className="cart-row-simple" key={entry.productId}>
                  <div className="cart-product-cell">
                    <img src={product.image} alt={product.name} />
                    <div>
                      <p className="product-name">{product.name}</p>
                      <button
                        type="button"
                        className="link-btn"
                        onClick={() => handleRowDelete(entry.productId)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                  <div className="cart-price">₱{product.price || 0}</div>
                  <div className="cart-qty">
                    <button type="button" onClick={() => handleQuantityChange(entry.productId, -1)}>
                      -
                    </button>
                    <span>{entry.quantity}</span>
                    <button type="button" onClick={() => handleQuantityChange(entry.productId, 1)}>
                      +
                    </button>
                  </div>
                  <div className="cart-line">₱{lineTotal}</div>
                </div>
              )
            })}
          </div>
        </section>

        <aside className="cart-card summary-card">
          <header>
            <h3>Cart Total</h3>
          </header>
          <div className="summary-row">
            <span>Subtotal:</span>
            <strong>₱{subtotal}</strong>
          </div>
          <div className="summary-row total">
            <span>Total:</span>
            <strong>₱{subtotal}</strong>
          </div>
          <button
            type="button"
            className="checkout-btn wide"
            onClick={handleCheckout}
            disabled={!cartItems.length}
          >
            Process to checkout
          </button>
        </aside>
      </div>
    </main>
  )
}

export default AddToCartPage

