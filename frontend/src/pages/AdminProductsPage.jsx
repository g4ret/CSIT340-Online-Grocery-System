import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

function AdminProductsPage({ onNavigate, showToast }) {
  const [products, setProducts] = useState([])
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All Categories')
  const [isAdding, setIsAdding] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: '',
    price: '',
    inventory: '',
    badge: '',
    image: '',
  })
  const [editingProductId, setEditingProductId] = useState(null)
  const [editDraft, setEditDraft] = useState({
    name: '',
    category: '',
    price: '',
    inventory: '',
    badge: '',
  })
  const [updatingProductId, setUpdatingProductId] = useState(null)
  const [deletingProductId, setDeletingProductId] = useState(null)

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase.from('products').select('*')

      if (error) {
        console.error('Error loading products from Supabase', error)
        if (showToast) {
          showToast('Failed to load products. Please try again.', 'error')
        }
      } else {
        setProducts(data)
      }
    } catch (err) {
      console.error('Unexpected error loading products from Supabase', err)
      if (showToast) {
        showToast('Failed to load products. Please try again.', 'error')
      }
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const filterOptions = useMemo(
    () => ['All Categories', ...new Set(products.map((item) => item.category))],
    [products]
  )

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase().trim())
      const matchesCategory = category === 'All Categories' || product.category === category
      return matchesSearch && matchesCategory
    })
  }, [search, category, products])

  const handleRefresh = () => {
    setSearch('')
    setCategory('All Categories')
    fetchProducts()
  }

  const handleStartAddProduct = () => {
    setIsAdding(true)
    setNewProduct({
      name: '',
      category: '',
      price: '',
      inventory: '',
      badge: '',
      image: '',
    })
  }

  const handleNewProductChange = (field, value) => {
    setNewProduct((previous) => ({
      ...previous,
      [field]: value,
    }))
  }

  const handleCancelAddProduct = () => {
    if (isSaving) return
    setIsAdding(false)
  }

  const handleSaveNewProduct = async () => {
    if (isSaving) return

    const trimmedName = newProduct.name.trim()
    const trimmedCategory = newProduct.category.trim()
    const priceValue = Number(newProduct.price)
    const inventoryValue = Number.isFinite(Number(newProduct.inventory))
      ? Number(newProduct.inventory)
      : 0
    const badgeValue = newProduct.badge.trim() || 'Active'

    if (!trimmedName || !trimmedCategory || !Number.isFinite(priceValue) || priceValue <= 0) {
      if (showToast) {
        showToast('Please provide a name, category, and valid price for the product.', 'error')
      }
      return
    }

    setIsSaving(true)

    try {
      const payload = {
        name: trimmedName,
        category: trimmedCategory,
        price: priceValue,
        inventory: inventoryValue,
        badge: badgeValue,
        image: newProduct.image.trim() || '/assets/products/placeholder.png',
      }

      const { data, error } = await supabase.from('products').insert([payload]).select().single()

      if (error) {
        console.error('Error adding product to Supabase', error)
        if (showToast) {
          showToast('Failed to add product. Please try again.', 'error')
        }
        return
      }

      setProducts((previous) => [data, ...previous])
      setIsAdding(false)
      if (showToast) {
        showToast('Product added.', 'success')
      }
    } catch (err) {
      console.error('Unexpected error adding product to Supabase', err)
      if (showToast) {
        showToast('Failed to add product. Please try again.', 'error')
      }
    } finally {
      setIsSaving(false)
    }
  }

  const handleStartEdit = (product) => {
    if (!product) return

    setEditingProductId(product.id)
    setEditDraft({
      name: product.name || '',
      category: product.category || '',
      price: String(product.price ?? ''),
      inventory: String(product.inventory ?? ''),
      badge: product.badge || '',
    })
  }

  const handleEditFieldChange = (field, value) => {
    setEditDraft((previous) => ({
      ...previous,
      [field]: value,
    }))
  }

  const handleCancelEdit = () => {
    if (updatingProductId) return
    setEditingProductId(null)
    setEditDraft({
      name: '',
      category: '',
      price: '',
      inventory: '',
      badge: '',
    })
  }

  const handleSaveEdit = async (productId) => {
    if (!productId || updatingProductId) return

    const trimmedName = editDraft.name.trim()
    const trimmedCategory = editDraft.category.trim()
    const priceValue = Number(editDraft.price)
    const inventoryValue = Number.isFinite(Number(editDraft.inventory))
      ? Number(editDraft.inventory)
      : 0
    const badgeValue = editDraft.badge.trim() || 'Active'

    if (!trimmedName || !trimmedCategory || !Number.isFinite(priceValue) || priceValue <= 0) {
      if (showToast) {
        showToast('Please provide a name, category, and valid price for the product.', 'error')
      }
      return
    }

    setUpdatingProductId(productId)

    try {
      const payload = {
        name: trimmedName,
        category: trimmedCategory,
        price: priceValue,
        inventory: inventoryValue,
        badge: badgeValue,
      }

      const { data, error } = await supabase
        .from('products')
        .update(payload)
        .eq('id', productId)
        .select()
        .single()

      if (error) {
        console.error('Error updating product in Supabase', error)
        if (showToast) {
          showToast('Failed to update product. Please try again.', 'error')
        }
        return
      }

      setProducts((previous) => previous.map((item) => (item.id === productId ? data : item)))
      setEditingProductId(null)
      setEditDraft({
        name: '',
        category: '',
        price: '',
        inventory: '',
        badge: '',
      })
      if (showToast) {
        showToast('Product updated.', 'success')
      }
    } catch (err) {
      console.error('Unexpected error updating product in Supabase', err)
      if (showToast) {
        showToast('Failed to update product. Please try again.', 'error')
      }
    } finally {
      setUpdatingProductId(null)
    }
  }

  const handleDeleteProduct = async (product) => {
    if (!product || deletingProductId) return

    const confirmDelete = window.confirm(
      `Delete product "${product.name}"? This cannot be undone and will remove it from listings.`,
    )

    if (!confirmDelete) return

    setDeletingProductId(product.id)

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', product.id)

      if (error) {
        console.error('Error deleting product from Supabase', error)
        if (showToast) {
          showToast('Failed to delete product. Please try again.', 'error')
        }
        return
      }

      setProducts((previous) => previous.filter((item) => item.id !== product.id))
      if (showToast) {
        showToast('Product deleted.', 'success')
      }
    } catch (err) {
      console.error('Unexpected error deleting product from Supabase', err)
      if (showToast) {
        showToast('Failed to delete product. Please try again.', 'error')
      }
    } finally {
      setDeletingProductId(null)
    }
  }

  return (
    <main className="admin-products">
      <div className="admin-products__shell">
        <header className="admin-page-header">
          <h1>Products</h1>
        </header>
        <section className="admin-products__controls">
          <div>
            <h2>All Products {filteredProducts.length.toLocaleString()}</h2>
          </div>
          <div className="control-row">
            <input
              type="search"
              placeholder="Search Products..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
            <select value={category} onChange={(event) => setCategory(event.target.value)}>
              {filterOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <button type="button" onClick={handleRefresh}>
              Refresh
            </button>
            <button type="button" className="primary" onClick={handleStartAddProduct}>
              + Add Product
            </button>
          </div>
        </section>

        {isAdding && (
          <section className="admin-products__add">
            <div className="control-row">
              <input
                type="text"
                placeholder="Product name"
                value={newProduct.name}
                onChange={(event) => handleNewProductChange('name', event.target.value)}
              />
              <input
                type="text"
                placeholder="Category"
                value={newProduct.category}
                onChange={(event) => handleNewProductChange('category', event.target.value)}
              />
              <input
                type="number"
                min="0"
                step="0.01"
                placeholder="Price"
                value={newProduct.price}
                onChange={(event) => handleNewProductChange('price', event.target.value)}
              />
              <input
                type="number"
                min="0"
                step="1"
                placeholder="Inventory"
                value={newProduct.inventory}
                onChange={(event) => handleNewProductChange('inventory', event.target.value)}
              />
              <input
                type="text"
                placeholder="Status badge (e.g. Best Seller)"
                value={newProduct.badge}
                onChange={(event) => handleNewProductChange('badge', event.target.value)}
              />
              <input
                type="text"
                placeholder="Image URL"
                value={newProduct.image}
                onChange={(event) => handleNewProductChange('image', event.target.value)}
              />
              <button
                type="button"
                className="primary"
                onClick={handleSaveNewProduct}
                disabled={isSaving}
              >
                {isSaving ? 'Saving...' : 'Save Product'}
              </button>
              <button type="button" onClick={handleCancelAddProduct} disabled={isSaving}>
                Cancel
              </button>
            </div>
          </section>
        )}

        <section className="admin-products__catalog">
          <div className="product-grid">
            {filteredProducts.map((product) => {
              const isEditing = editingProductId === product.id
              const isBusy =
                updatingProductId === product.id || deletingProductId === product.id

              const draftPrice = Number(isEditing ? editDraft.price || 0 : product.price || 0)

              return (
                <article className="home-product-card admin-product-card" key={product.id}>
                  <span className="discount-pill">
                    {isEditing ? editDraft.badge || product.badge : product.badge}
                  </span>
                  <div className="product-actions">
                    {isEditing ? (
                      <>
                        <button
                          type="button"
                          className="primary"
                          onClick={() => handleSaveEdit(product.id)}
                          disabled={isBusy}
                        >
                          {isBusy ? 'Saving...' : 'Save'}
                        </button>
                        <button
                          type="button"
                          onClick={handleCancelEdit}
                          disabled={isBusy}
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          type="button"
                          className="edit"
                          onClick={() => handleStartEdit(product)}
                          disabled={isBusy}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="danger"
                          onClick={() => handleDeleteProduct(product)}
                          disabled={isBusy}
                        >
                          {deletingProductId === product.id ? 'Deleting...' : 'Delete'}
                        </button>
                      </>
                    )}
                  </div>

                  <img src={product.image} alt={product.name} loading="lazy" />

                  <p className="stock-count">
                    {isEditing ? (
                      <>
                        <small className="admin-edit-label">Category</small>
                        <input
                          type="text"
                          value={editDraft.category}
                          onChange={(event) =>
                            handleEditFieldChange('category', event.target.value)
                          }
                        />
                      </>
                    ) : (
                      product.category
                    )}
                  </p>

                  {isEditing ? (
                    <div className="admin-edit-field">
                      <small className="admin-edit-label">Name</small>
                      <input
                        type="text"
                        value={editDraft.name}
                        onChange={(event) => handleEditFieldChange('name', event.target.value)}
                      />
                    </div>
                  ) : (
                    <h3>{product.name}</h3>
                  )}

                  <div className="price-row">
                    {isEditing ? (
                      <>
                        <div className="admin-edit-field">
                          <small className="admin-edit-label">Price</small>
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={editDraft.price}
                            onChange={(event) =>
                              handleEditFieldChange('price', event.target.value)
                            }
                          />
                        </div>
                        <span className="old-price">₱{(draftPrice * 1.2).toFixed(2)}</span>
                      </>
                    ) : (
                      <>
                        <strong>₱{product.price.toFixed(2)}</strong>
                        <span className="old-price">
                          ₱{(Number(product.price || 0) * 1.2).toFixed(2)}
                        </span>
                      </>
                    )}
                  </div>

                  <p className="stock-count">
                    {isEditing ? (
                      <>
                        <small className="admin-edit-label">Stock</small>
                        <input
                          type="number"
                          min="0"
                          step="1"
                          value={editDraft.inventory}
                          onChange={(event) =>
                            handleEditFieldChange('inventory', event.target.value)
                          }
                        />
                      </>
                    ) : (
                      `${product.inventory} in stock`
                    )}
                  </p>
                </article>
              )
            })}
          </div>
        </section>
      </div>
    </main>
  )
}

export default AdminProductsPage

