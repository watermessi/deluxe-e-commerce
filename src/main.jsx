import { useEffect, useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, Check, ChevronDown, Menu, Minus, Plus, Search, ShoppingBag, SlidersHorizontal, Trash2, X } from 'lucide-react'
import { supabase } from './supabase'
import './styles.css'

const previewProducts = [
  { id: 1, name: 'Gold & Silver Choker Set', category: 'Jewellery', priceNgn: 20500, priceLabel: '₦20,500', image: '/products/product-01.jpg' },
  { id: 2, name: 'Gold Choker', category: 'Jewellery', priceNgn: 12500, priceLabel: '₦12,500', image: '/products/product-02.jpg' },
  { id: 3, name: 'Gold Choker Necklace', category: 'Jewellery', priceNgn: 18000, priceLabel: '₦18,000', image: '/products/product-03.jpg' },
  { id: 4, name: 'Gold & Silver Choker', category: 'Jewellery', priceNgn: 15000, priceLabel: '₦15,000', image: '/products/product-04.jpg' },
  { id: 5, name: 'Gold Choker Set', category: 'Jewellery', priceNgn: 18500, priceLabel: '₦18,500', image: '/products/product-05.jpg' },
  { id: 6, name: 'Gold Choker Set', category: 'Jewellery', priceNgn: 18500, priceLabel: '₦18,500', image: '/products/product-06.jpg' },
  { id: 7, name: 'Gold Choker', category: 'Jewellery', priceNgn: 18000, priceLabel: '₦18,000', image: '/products/product-07.jpg' },
  { id: 8, name: 'Gold Choker Set', category: 'Jewellery', priceNgn: 18000, priceLabel: '₦18,000', image: '/products/product-08.jpg' },
  { id: 9, name: 'Silver Statement Earring', category: 'Jewellery', priceNgn: 10000, priceLabel: '₦10,000', image: '/products/product-09.jpg' },
  { id: 10, name: 'Statement Earring', category: 'Jewellery', priceNgn: 9000, priceLabel: '₦9,000', image: '/products/product-10.jpg' },
  { id: 11, name: 'High Zirconia 4-Piece Necklace Set', category: 'Jewellery', priceNgn: 75000, priceLabel: '₦75,000', image: '/products/product-11.jpg' },
]

const categories = ['Everything', 'Jewellery']
const formatNaira = (amount) => `₦${amount.toLocaleString('en-NG')}`

function App() {
  const [category, setCategory] = useState('Everything')
  const [sort, setSort] = useState('featured')
  const [searchOpen, setSearchOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [mobileMenu, setMobileMenu] = useState(false)
  const [products, setProducts] = useState(previewProducts)
  const [catalogStatus, setCatalogStatus] = useState(supabase ? 'loading' : 'preview')
  const [cart, setCart] = useState([])
  const [cartOpen, setCartOpen] = useState(false)
  const [checkoutStage, setCheckoutStage] = useState('bag')
  const [addedProductId, setAddedProductId] = useState(null)

  useEffect(() => {
    if (!supabase) return

    let cancelled = false
    supabase
      .from('products')
      .select('id, catalog_key, name, category, price_label, price_ngn, image_url')
      .eq('is_active', true)
      .order('sort_order')
      .then(({ data, error }) => {
        if (cancelled) return
        if (error) {
          setCatalogStatus('error')
          return
        }
        setProducts(data.map((product) => ({ ...product, image: product.image_url, priceLabel: product.price_label, priceNgn: product.price_ngn })))
        setCatalogStatus('live')
      })

    return () => { cancelled = true }
  }, [])

  const visibleProducts = useMemo(() => {
    const query = search.trim().toLowerCase()
    const matching = products.filter((product) => {
      const matchesCategory = category === 'Everything' || product.category === category
      const matchesSearch = !query || `${product.name} ${product.category}`.toLowerCase().includes(query)
      return matchesCategory && matchesSearch
    })
    if (sort === 'name') return [...matching].sort((a, b) => a.name.localeCompare(b.name))
    return matching
  }, [category, search, sort, products])

  function addToCart(product) {
    setCart((items) => {
      const existingItem = items.find((item) => item.product.id === product.id)
      if (existingItem) return items.map((item) => item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)
      return [...items, { product, quantity: 1 }]
    })
    setAddedProductId(product.id)
    window.setTimeout(() => setAddedProductId(null), 1200)
  }

  function changeQuantity(productId, amount) {
    setCart((items) => items
      .map((item) => item.product.id === productId ? { ...item, quantity: item.quantity + amount } : item)
      .filter((item) => item.quantity > 0))
  }

  function removeFromCart(productId) {
    setCart((items) => items.filter((item) => item.product.id !== productId))
  }

  function closeCart() {
    setCartOpen(false)
    setCheckoutStage('bag')
  }

  function completeCheckout(event) {
    event.preventDefault()
    setCheckoutStage('complete')
  }

  const cartCount = cart.reduce((count, item) => count + item.quantity, 0)
  const cartTotal = cart.reduce((total, item) => total + item.product.priceNgn * item.quantity, 0)

  return (
    <div className="shop-shell">
      <div className="announcement"><span>DEE LUXE HUB ENTERPRISES</span><span>Luxury finds, delivered across Nigeria <ArrowUpRight size={12} /></span><span>PRICES IN NGN</span></div>
      <header className="site-header">
        <button className="icon-button mobile-menu-toggle" aria-label="Open menu" onClick={() => setMobileMenu(!mobileMenu)}><Menu size={20} /></button>
        <nav className={`primary-nav ${mobileMenu ? 'is-open' : ''}`} aria-label="Main navigation">
          <a href="#shop" onClick={() => { setCategory('Everything'); setMobileMenu(false) }}>Shop all</a>
          <a href="#shop" onClick={() => { setCategory('Jewellery'); setMobileMenu(false) }}>Jewellery</a>
        </nav>
        <a className="wordmark" href="#top" aria-label="Dee Luxe Hub home"><span className="brand-symbol" aria-hidden="true" />DEE LUXE<span>HUB</span></a>
        <div className="header-actions">
          <button className="icon-button search-toggle" aria-label="Search products" onClick={() => setSearchOpen(!searchOpen)}><Search size={19} /></button>
          <button className="icon-button bag-link" aria-label={`Open shopping bag, ${cartCount} items`} onClick={() => { setCheckoutStage('bag'); setCartOpen(true) }}><ShoppingBag size={19} /><span className="action-label">Bag</span>{cartCount > 0 && <span className="count-dot">{cartCount}</span>}</button>
        </div>
      </header>

      {searchOpen && <div className="search-panel"><Search size={19} /><input autoFocus value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search the edit..." aria-label="Search products" /><button className="icon-button" aria-label="Close search" onClick={() => { setSearchOpen(false); setSearch('') }}><X size={18} /></button></div>}

      <main id="top">
        <section className="hero" aria-label="New season edit">
          <div className="hero-copy">
            <span className="eyebrow"><span className="eyebrow-rule" /> YOUR LUXURY, CLOSER</span>
            <h1>Find your<br /><em>kind</em><br />of luxe.</h1>
            <p>Statement jewellery and occasion pieces, curated by Dee Luxe Hub. Add your favourites to the bag, then message us to confirm availability.</p>
            <a className="hero-link" href="#shop">Shop the Dee Luxe edit <ArrowRight size={16} /></a>
            <span className="hero-index">01 <span /> DEE LUXE HUB ENTERPRISES</span>
          </div>
          <div className="hero-visual">
            <img src="/dee-luxe-bag-mockup.jpg" alt="Dee Luxe Hub branded shopping bag in the official burgundy and blush identity" />
            <div className="hero-image-note"><span>DEE LUXE HUB ENTERPRISES</span><span>YOUR LUXURY, DELIVERED</span></div>
            <div className="hero-sticker">Your next<br />favourite <ArrowDown size={14} /></div>
          </div>
        </section>

        <div className="origin-strip" aria-label="Dee Luxe Hub services">
          <span><b>01</b> Luxury brand discovery</span>
          <span><b>02</b> Personal shopping</span>
          <span><b>03</b> Nationwide delivery</span>
          <span className="origin-location">LAGOS · NIGERIA</span>
        </div>

        <section className="shop-section" id="shop">
          <div className="section-heading">
            <div><span className="eyebrow"><span className="eyebrow-rule" /> THE DEE LUXE EDIT</span><h2>A little more <em>luxe.</em></h2></div>
            <p>Explore signature jewellery and<br />occasion-ready sets.</p>
          </div>
          <div className="shop-controls">
            <div className="category-tabs" role="tablist" aria-label="Filter by category">
              {categories.map((item) => <button key={item} role="tab" aria-selected={category === item} className={category === item ? 'active' : ''} onClick={() => { setCategory(item); setWishlistOnly(false) }}>{item === 'Everything' ? 'All' : item}</button>)}
            </div>
            <label className="sort-control"><SlidersHorizontal size={15} /><span>Sort</span><select value={sort} onChange={(event) => setSort(event.target.value)} aria-label="Sort products"><option value="featured">Featured</option><option value="name">Name: A to Z</option></select><ChevronDown size={14} /></label>
          </div>
          <p className="catalog-note">Dee Luxe Hub collection. Prices and availability are confirmed before payment.</p>

          {visibleProducts.length ? <div className="product-grid">
            {visibleProducts.map((product, index) => <article className="product-card" key={product.id} style={{ '--card-delay': `${index * 55}ms` }}>
              <div className="product-image">
                <img className="catalog-product-image" src={product.image} alt={product.name} loading={index > 1 ? 'lazy' : 'eager'} />
                <button className={`quick-add ${addedProductId === product.id ? 'added' : ''}`} onClick={() => addToCart(product)}>{addedProductId === product.id ? <><Check size={15} /> Added to bag</> : <><ShoppingBag size={15} /> Add to bag <ArrowUpRight size={14} /></>}</button>
              </div>
              <div className="product-info"><strong className="product-price">{product.priceLabel}</strong></div>
            </article>)}
          </div> : <div className="empty-results"><Search size={23} /><p>No pieces found for “{search}”.</p><button onClick={() => { setSearch(''); setCategory('Everything') }}>Clear filters</button></div>}

          <div className="browse-more"><span>Showing {visibleProducts.length} of {products.length} pieces</span></div>
        </section>

        <section className="values-strip"><div className="values-number">A hub for<br /><em>the good stuff.</em></div><div className="values-copy"><span className="eyebrow">DEE LUXE HUB ENTERPRISES</span><p>We connect you with luxury brands, bringing a considered selection of products and services together in one place, with convenient delivery across Nigeria.</p><a href="https://wa.me/2348141312113">Shop with us on WhatsApp <ArrowUpRight size={14} /></a></div><div className="values-aside"><span>BASED IN NIGERIA</span><span>LUXURY, MADE<br />MORE ACCESSIBLE.</span><span className="values-stamp">D<span>H</span></span></div></section>
      </main>

      {cartOpen && <div className="drawer-backdrop" onClick={closeCart}>
        <aside className="cart-drawer" role="dialog" aria-modal="true" aria-label="Shopping bag" onClick={(event) => event.stopPropagation()}>
          <div className="drawer-heading"><div>{checkoutStage === 'bag' ? <><span className="eyebrow">YOUR SELECTION</span><h2>Your bag <span>({cartCount})</span></h2></> : <><span className="eyebrow">DEE LUXE HUB</span><h2>{checkoutStage === 'complete' ? 'Checkout preview' : 'Your details'}</h2></>}</div><button className="icon-button" aria-label="Close shopping bag" onClick={closeCart}><X size={19} /></button></div>
          {cart.length && checkoutStage === 'bag' ? <>
            <div className="cart-items">{cart.map(({ product, quantity }) => <article className="cart-item" key={product.id}>
              <div className="cart-product-art"><img src={product.image} alt="" /></div>
              <div className="cart-item-info"><h3>{product.name}</h3><span>{formatNaira(product.priceNgn)} each</span><div className="quantity-control"><button aria-label={`Remove one ${product.name}`} onClick={() => changeQuantity(product.id, -1)}><Minus size={12} /></button><span>{quantity}</span><button aria-label={`Add one ${product.name}`} onClick={() => changeQuantity(product.id, 1)}><Plus size={12} /></button></div></div>
              <div className="cart-item-total"><strong>{formatNaira(product.priceNgn * quantity)}</strong><button className="icon-button" aria-label={`Remove ${product.name} from bag`} onClick={() => removeFromCart(product.id)}><Trash2 size={15} /></button></div>
            </article>)}</div>
            <div className="cart-summary"><div className="subtotal-row"><span>Subtotal</span><strong>{formatNaira(cartTotal)}</strong></div><p className="shipping-note">Delivery is arranged after checkout. No payment is taken in this preview.</p><button className="checkout-button" onClick={() => setCheckoutStage('form')}>Continue to checkout <ArrowRight size={16} /></button></div>
          </> : cart.length && checkoutStage === 'form' ? <form className="checkout-form" onSubmit={completeCheckout}>
            <button type="button" className="back-to-bag" onClick={() => setCheckoutStage('bag')}><ArrowLeft size={14} /> Back to bag</button>
            <p className="checkout-intro">Add your delivery details to review this frontend checkout.</p>
            <label>Full name<input name="name" autoComplete="name" required placeholder="Your name" /></label>
            <label>Phone number<input name="phone" type="tel" autoComplete="tel" required placeholder="080 0000 0000" /></label>
            <label>Delivery address<textarea name="address" autoComplete="street-address" required rows="3" placeholder="Street, area and city" /></label>
            <div className="checkout-total"><span>Order subtotal</span><strong>{formatNaira(cartTotal)}</strong></div>
            <p className="checkout-disclaimer">Frontend preview only. Your details are not sent or saved, and no payment or real order is processed.</p>
            <button className="checkout-button" type="submit">Review checkout <ArrowRight size={16} /></button>
          </form> : checkoutStage === 'complete' ? <div className="checkout-complete"><span className="checkout-check"><Check size={22} /></span><h3>Checkout preview ready</h3><p>Your bag has {cartCount} {cartCount === 1 ? 'item' : 'items'} with a subtotal of {formatNaira(cartTotal)}.</p><p className="checkout-disclaimer">This is a frontend-only preview. Nothing has been sent, saved, or charged.</p><button className="checkout-button" onClick={closeCart}>Continue shopping <ArrowRight size={16} /></button></div> : <div className="empty-bag"><ShoppingBag size={27} /><h3>Your bag is empty</h3><p>Add a piece from the collection to begin.</p><button onClick={closeCart}>Continue shopping</button></div>}
        </aside>
      </div>}

      <footer className="site-footer"><a className="wordmark footer-wordmark" href="#top"><span className="brand-symbol" aria-hidden="true" />DEE LUXE<span>HUB</span></a><a className="social-link" href="https://instagram.com/deeluxehub" target="_blank" rel="noreferrer">@deeluxehub <ArrowUpRight size={13} /></a><a className="social-link" href="https://wa.me/2348141312113">WhatsApp +234 814 131 2113 <ArrowUpRight size={13} /></a><span>© Dee Luxe Hub Enterprises 2026</span><a href="https://deeluxehub.com">deeluxehub.com <ArrowUpRight size={13} /></a></footer>

    </div>
  )
}

createRoot(document.getElementById('root')).render(<App />)