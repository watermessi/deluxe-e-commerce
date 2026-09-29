import { useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { ArrowDown, ArrowRight, ArrowUpRight, ChevronDown, Heart, Instagram, Menu, MessageCircle, Search, SlidersHorizontal, X } from 'lucide-react'
import './styles.css'

const products = [
  { id: 1, name: 'Jewellery Gift Box', category: 'Gift sets', type: 'Gift set', description: 'A curated jewellery box for someone special.', badge: 'Gift idea', image: '/instagram-jewelry-box.jpg', post: 'https://www.instagram.com/deeluxehub/p/Dbf7JUeI_8f/' },
  { id: 2, name: 'Gold-Tone Jewellery Edit', category: 'Jewellery', type: 'Jewellery', description: 'A selection from the Dee Luxe jewellery edit.', badge: 'From Instagram', image: '/instagram-jewelry-edit.jpg', post: 'https://www.instagram.com/deeluxehub/p/Dbf7DsAoiCM/' },
  { id: 3, name: 'Sunglasses & Pop-Up Finds', category: 'Eyewear', type: 'Eyewear', description: 'Eyewear and accessory finds from a Dee Luxe pop-up.', badge: 'From the pop-up', image: '/instagram-pop-up.jpg', post: 'https://www.instagram.com/deeluxehub/p/DTAJFQSCGCu/' },
  { id: 4, name: 'Gold Statement Ring', category: 'Jewellery', type: 'Jewellery', description: 'A gold-tone statement piece featured on @deeluxehub.', badge: 'Just posted', image: '/instagram-latest-pick.jpg', post: 'https://www.instagram.com/deeluxehub/p/DahkJEaCAjv/' },
]

const categories = ['Everything', 'Jewellery', 'Eyewear', 'Gift sets']
const whatsappOrderUrl = (product) => `https://wa.me/2348141312113?text=${encodeURIComponent(`Hi Dee Luxe Hub, I'm interested in the ${product.name}. Please share today's price and availability. ${product.post}`)}`

function App() {
  const [category, setCategory] = useState('Everything')
  const [sort, setSort] = useState('featured')
  const [searchOpen, setSearchOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [wishlist, setWishlist] = useState([])
  const [mobileMenu, setMobileMenu] = useState(false)
  const [wishlistOnly, setWishlistOnly] = useState(false)

  const visibleProducts = useMemo(() => {
    const query = search.trim().toLowerCase()
    const matching = products.filter((product) => {
      const matchesCategory = category === 'Everything' || product.category === category
      const matchesWishlist = !wishlistOnly || wishlist.includes(product.id)
      const matchesSearch = !query || `${product.name} ${product.category} ${product.type} ${product.color}`.toLowerCase().includes(query)
      return matchesCategory && matchesWishlist && matchesSearch
    })
    if (sort === 'name') return [...matching].sort((a, b) => a.name.localeCompare(b.name))
    return matching
  }, [category, search, sort, wishlist, wishlistOnly])

  function toggleWishlist(id) {
    setWishlist((items) => items.includes(id) ? items.filter((item) => item !== id) : [...items, id])
  }

  return (
    <div className="shop-shell">
      <div className="announcement"><span>DEE LUXE HUB ENTERPRISES</span><span>Luxury finds, delivered across Nigeria <ArrowUpRight size={12} /></span><span>PRICES IN NGN</span></div>
      <header className="site-header">
        <button className="icon-button mobile-menu-toggle" aria-label="Open menu" onClick={() => setMobileMenu(!mobileMenu)}><Menu size={20} /></button>
        <nav className={`primary-nav ${mobileMenu ? 'is-open' : ''}`} aria-label="Main navigation">
          <a href="#shop" onClick={() => { setCategory('Everything'); setMobileMenu(false) }}>Shop all</a>
          <a href="#shop" onClick={() => { setCategory('Jewellery'); setMobileMenu(false) }}>Jewellery</a>
          <a href="#shop" onClick={() => { setCategory('Eyewear'); setMobileMenu(false) }}>Eyewear</a>
          <a href="#shop" onClick={() => { setCategory('Gift sets'); setMobileMenu(false) }}>Gift sets</a>
        </nav>
        <a className="wordmark" href="#top" aria-label="Dee Luxe Hub home"><span className="brand-symbol" aria-hidden="true" />DEE LUXE<span>HUB</span></a>
        <div className="header-actions">
          <button className="icon-button search-toggle" aria-label="Search products" onClick={() => setSearchOpen(!searchOpen)}><Search size={19} /></button>
          <button className="icon-button wishlist-link" aria-label={`${wishlistOnly ? 'Show all products' : 'Show saved products'}, ${wishlist.length} saved`} onClick={() => { setCategory('Everything'); setSearch(''); setWishlistOnly(!wishlistOnly) }}><Heart size={19} /><span className="action-label">Saved</span>{wishlist.length > 0 && <span className="count-dot">{wishlist.length}</span>}</button>
          <a className="icon-button bag-link" href="https://wa.me/2348141312113" target="_blank" rel="noreferrer" aria-label="Ask Dee Luxe Hub on WhatsApp"><MessageCircle size={19} /><span className="action-label">Enquire</span></a>
        </div>
      </header>

      {searchOpen && <div className="search-panel"><Search size={19} /><input autoFocus value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search the edit..." aria-label="Search products" /><button className="icon-button" aria-label="Close search" onClick={() => { setSearchOpen(false); setSearch('') }}><X size={18} /></button></div>}

      <main id="top">
        <section className="hero" aria-label="New season edit">
          <div className="hero-copy">
            <span className="eyebrow"><span className="eyebrow-rule" /> YOUR LUXURY, CLOSER</span>
            <h1>Find your<br /><em>kind</em><br />of luxe.</h1>
            <p>Jewellery, bags, sunglasses and wristwatches curated by Dee Luxe Hub. Find your favourite, then message us for current prices and availability.</p>
            <a className="hero-link" href="#shop">Shop Instagram finds <ArrowRight size={16} /></a>
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
            <p>Explore the edit across fashion, accessories<br />and pieces for your space.</p>
          </div>
          <div className="shop-controls">
            <div className="category-tabs" role="tablist" aria-label="Filter by category">
              {categories.map((item) => <button key={item} role="tab" aria-selected={category === item} className={category === item ? 'active' : ''} onClick={() => { setCategory(item); setWishlistOnly(false) }}>{item === 'Everything' ? 'All' : item}</button>)}
            </div>
            <label className="sort-control"><SlidersHorizontal size={15} /><span>Sort</span><select value={sort} onChange={(event) => setSort(event.target.value)} aria-label="Sort products"><option value="featured">Featured</option><option value="name">Name: A to Z</option></select><ChevronDown size={14} /></label>
          </div>
          <p className="catalog-note">Selected from @deeluxehub · Message us for current prices and availability.</p>

          {visibleProducts.length ? <div className="product-grid">
            {visibleProducts.map((product, index) => <article className="product-card" key={product.id} style={{ '--card-delay': `${index * 55}ms` }}>
              <div className="product-image">
                <a className="product-post-image" href={product.post} target="_blank" rel="noreferrer" aria-label={`View ${product.name} on Instagram`}><img src={product.image} alt={product.name} loading={index > 1 ? 'lazy' : 'eager'} /></a>
                {product.badge && <span className="product-badge">{product.badge}</span>}
                <button className={`wishlist-button ${wishlist.includes(product.id) ? 'is-saved' : ''}`} aria-label={wishlist.includes(product.id) ? `Remove ${product.name} from saved items` : `Save ${product.name}`} onClick={() => toggleWishlist(product.id)}><Heart size={17} fill={wishlist.includes(product.id) ? 'currentColor' : 'none'} /></button>
                <a className="quick-add" href={whatsappOrderUrl(product)} target="_blank" rel="noreferrer"><MessageCircle size={15} /> Ask for price <ArrowUpRight size={14} /></a>
              </div>
              <div className="product-info"><div><h3>{product.name}</h3><span>{product.description}</span></div><a className="product-post-link" href={product.post} target="_blank" rel="noreferrer"><Instagram size={15} aria-label="Instagram post" /></a></div>
              <span className="product-type">{product.type}</span>
            </article>)}
          </div> : <div className="empty-results"><Search size={23} /><p>No pieces found for “{search}”.</p><button onClick={() => { setSearch(''); setCategory('Everything') }}>Clear filters</button></div>}

          <div className="browse-more"><span>Showing {visibleProducts.length} of {products.length} Instagram finds</span><a href="https://www.instagram.com/deeluxehub/" target="_blank" rel="noreferrer">More from @deeluxehub <ArrowUpRight size={15} /></a></div>
        </section>

        <section className="values-strip"><div className="values-number">A hub for<br /><em>the good stuff.</em></div><div className="values-copy"><span className="eyebrow">DEE LUXE HUB ENTERPRISES</span><p>We connect you with luxury brands, bringing a considered selection of products and services together in one place, with convenient delivery across Nigeria.</p><a href="https://wa.me/2348141312113">Shop with us on WhatsApp <ArrowUpRight size={14} /></a></div><div className="values-aside"><span>BASED IN NIGERIA</span><span>LUXURY, MADE<br />MORE ACCESSIBLE.</span><span className="values-stamp">D<span>H</span></span></div></section>
      </main>

      <footer className="site-footer"><a className="wordmark footer-wordmark" href="#top"><span className="brand-symbol" aria-hidden="true" />DEE LUXE<span>HUB</span></a><a className="social-link" href="https://instagram.com/deeluxehub">@deeluxehub <ArrowUpRight size={13} /></a><a className="social-link" href="https://wa.me/2348141312113">WhatsApp +234 814 131 2113 <ArrowUpRight size={13} /></a><span>© Dee Luxe Hub Enterprises 2026</span><a href="https://deeluxehub.com">deeluxehub.com <ArrowUpRight size={13} /></a></footer>

    </div>
  )
}

createRoot(document.getElementById('root')).render(<App />)