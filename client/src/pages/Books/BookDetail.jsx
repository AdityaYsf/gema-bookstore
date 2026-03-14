import { useEffect, useState, useCallback } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ShoppingCart, Heart, Share2, ArrowLeft, Star, BookOpen, Minus, Plus, Check, ChevronRight } from 'lucide-react'
import { useCart } from '../../context/CartContext'
import api from '../../services/api'

/* ─────────────────────────────────────────
   GOOGLE BOOKS HOOK
───────────────────────────────────────── */
const useGoogleBooksData = (title, author, needsCover, needsDesc) => {
  const [cover, setCover]      = useState(null)
  const [description, setDesc] = useState(null)
  const [gbData, setGbData]    = useState(null)

  useEffect(() => {
    if (!title || (!needsCover && !needsDesc)) return
    const apiKey = import.meta.env.VITE_GOOGLE_BOOKS_API_KEY
    const query  = author ? `${title} ${author}` : title
    const url    = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=1${apiKey ? `&key=${apiKey}` : ''}`

    fetch(url)
      .then(r => r.json())
      .then(data => {
        const item = data.items?.[0]
        if (!item) return
        const info = item.volumeInfo || {}

        if (needsCover) {
          const img = info.imageLinks
          const raw = img?.extraLarge || img?.large || img?.medium || img?.thumbnail || null
          if (raw) setCover(raw.replace('http://', 'https://').replace(/&zoom=\d/, '').replace(/&edge=curl/, '') + '&fife=w800')
        }
        if (needsDesc && info.description) setDesc(info.description)

        setGbData({
          publisher:    info.publisher     || null,
          publishedAt:  info.publishedDate ? info.publishedDate.substring(0, 4) : null,
          pageCount:    info.pageCount     || null,
          language:     info.language      || null,
          rating:       info.averageRating || null,
          ratingsCount: info.ratingsCount  || 0,
        })
      })
      .catch(() => {})
  }, [title, author, needsCover, needsDesc])

  return { cover, description, gbData }
}

/* ─────────────────────────────────────────
   STYLES
───────────────────────────────────────── */
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,700;0,9..144,900;1,9..144,400&display=swap');

  :root {
    --navy:      #0f1e42;
    --navy-mid:  #1a2f5e;
    --copper:    #d4823a;
    --copper-dk: #b06828;
    --copper-lt: #e8a060;
    --bg:        #f8f9fc;
    --bg-card:   #ffffff;
    --border:    rgba(15,30,66,0.08);
    --border-md: rgba(15,30,66,0.14);
    --ink2:      #3a4a6e;
    --ink3:      #6272a0;
    --ink4:      #9aa3c2;
    --green:     #16a34a;
    --green-bg:  #dcfce7;
    --red:       #dc2626;
    --red-bg:    #fee2e2;
  }
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .bd-root { font-family: 'Poppins', sans-serif; background: var(--bg); color: var(--navy); min-height: 100vh; }

  /* NAV */
  .bd-nav {
    background: rgba(255,255,255,0.9);
    border-bottom: 1px solid var(--border);
    padding: 0.85rem clamp(1.5rem, 6vw, 5rem);
    display: flex; align-items: center; gap: 0.4rem;
    font-size: 0.72rem; font-weight: 500; color: var(--ink4);
    position: sticky; top: 0; z-index: 50;
    backdrop-filter: blur(12px);
  }
  .bd-nav a { color: var(--ink3); text-decoration: none; transition: color 0.18s; }
  .bd-nav a:hover { color: var(--copper-dk); }
  .bd-nav-sep { color: var(--border-md); }
  .bd-nav-cur { color: var(--ink2); font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 220px; }
  .bd-back-btn {
    margin-left: auto; display: flex; align-items: center; gap: 0.35rem;
    background: none; border: 1px solid var(--border-md); border-radius: 7px;
    padding: 0.35rem 0.85rem; cursor: pointer;
    font-family: 'Poppins', sans-serif; font-size: 0.72rem; font-weight: 600;
    color: var(--ink3); transition: all 0.2s; white-space: nowrap;
  }
  .bd-back-btn:hover { border-color: var(--navy); color: var(--navy); background: var(--bg); }

  /* MAIN LAYOUT */
  .bd-main {
    max-width: 1180px; margin: 0 auto;
    padding: clamp(2rem, 5vw, 3.5rem) clamp(1.5rem, 5vw, 3rem);
    display: grid; grid-template-columns: 300px 1fr;
    gap: 3rem; align-items: start;
  }
  @media (max-width: 860px) { .bd-main { grid-template-columns: 1fr; gap: 2rem; } }

  /* LEFT */
  .bd-left { display: flex; flex-direction: column; gap: 1rem; position: sticky; top: 4rem; }

  .bd-cover-wrap {
    width: 100%; border-radius: 14px; overflow: hidden;
    background: linear-gradient(135deg, #e8ecf7, #d4daf0);
    aspect-ratio: 3/4;
    box-shadow: 0 24px 60px rgba(15,30,66,0.18), 0 4px 16px rgba(15,30,66,0.1);
    position: relative;
  }
  .bd-cover-img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 0.5s; }
  .bd-cover-wrap:hover .bd-cover-img { transform: scale(1.03); }
  .bd-cover-ph {
    width: 100%; height: 100%; display: flex; flex-direction: column;
    align-items: center; justify-content: center; gap: 0.75rem; color: var(--ink4);
  }
  .bd-cover-ph-title { font-size: 0.8rem; font-weight: 600; color: var(--ink3); text-align: center; padding: 0 1.5rem; line-height: 1.4; }
  .bd-cover-shimmer {
    position: absolute; inset: 0;
    background: linear-gradient(90deg, transparent 25%, rgba(255,255,255,0.4) 50%, transparent 75%);
    background-size: 200% 100%; animation: shimmer 1.5s infinite;
  }
  @keyframes shimmer { from{background-position:200% 0} to{background-position:-200% 0} }

  /* Action btns */
  .bd-left-actions { display: flex; gap: 0.6rem; }
  .bd-action-btn {
    flex: 1; display: flex; align-items: center; justify-content: center; gap: 0.4rem;
    padding: 0.6rem 0.75rem; border-radius: 10px;
    border: 1px solid var(--border-md); background: var(--bg-card);
    font-family: 'Poppins', sans-serif; font-size: 0.73rem; font-weight: 600;
    color: var(--ink3); cursor: pointer; transition: all 0.2s;
  }
  .bd-action-btn:hover { border-color: var(--navy); color: var(--navy); }
  .bd-action-btn.active { border-color: #f43f5e; color: #f43f5e; background: #fff1f2; }

  /* Spec table */
  .bd-spec-table { background: var(--bg-card); border: 1px solid var(--border); border-radius: 12px; overflow: hidden; }
  .bd-spec-row {
    display: flex; justify-content: space-between; align-items: center;
    padding: 0.65rem 1rem; font-size: 0.74rem;
    border-bottom: 1px solid var(--border);
  }
  .bd-spec-row:last-child { border-bottom: none; }
  .bd-spec-label { color: var(--ink4); font-weight: 500; }
  .bd-spec-val { color: var(--ink2); font-weight: 600; text-align: right; }

  /* RIGHT */
  .bd-right { display: flex; flex-direction: column; gap: 1.75rem; }

  .bd-eyebrow { display: flex; align-items: center; gap: 0.6rem; flex-wrap: wrap; }
  .bd-cat-badge {
    font-size: 0.62rem; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase;
    background: rgba(212,130,58,0.1); color: var(--copper-dk);
    padding: 0.28rem 0.75rem; border-radius: 100px; border: 1px solid rgba(212,130,58,0.22);
  }
  .bd-rating { display: flex; align-items: center; gap: 0.35rem; font-size: 0.78rem; color: var(--ink3); }
  .bd-stars { display: flex; gap: 2px; color: var(--copper); }

  .bd-title {
    font-family: 'Fraunces', serif;
    font-size: clamp(1.8rem, 4vw, 2.7rem);
    font-weight: 900; line-height: 1.1; color: var(--navy); letter-spacing: -0.02em;
  }
  .bd-author { font-size: 0.95rem; color: var(--ink3); margin-top: 0.5rem; }
  .bd-author strong { color: var(--copper-dk); font-weight: 600; }

  /* Purchase box */
  .bd-purchase-box {
    background: var(--bg-card); border: 1px solid var(--border);
    border-radius: 14px; padding: 1.5rem; display: flex; flex-direction: column; gap: 1.25rem;
  }
  .bd-price-row { display: flex; align-items: flex-end; justify-content: space-between; flex-wrap: wrap; gap: 0.75rem; }
  .bd-price-lbl { font-size: 0.6rem; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; color: var(--ink4); margin-bottom: 0.2rem; }
  .bd-price { font-family: 'Fraunces', serif; font-size: 2rem; font-weight: 900; color: var(--navy); letter-spacing: -0.02em; }
  .bd-stock-pill {
    display: inline-flex; align-items: center; gap: 0.4rem;
    font-size: 0.68rem; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase;
    padding: 0.38rem 0.85rem; border-radius: 100px;
  }
  .bd-stock-pill.in  { background: var(--green-bg); color: var(--green); }
  .bd-stock-pill.out { background: var(--red-bg);   color: var(--red); }
  .bd-stock-dot { width: 6px; height: 6px; border-radius: 50%; background: currentColor; flex-shrink: 0; }

  .bd-cta-row { display: flex; gap: 0.75rem; align-items: center; }
  .bd-qty {
    display: flex; align-items: center;
    border: 1px solid var(--border-md); border-radius: 10px; overflow: hidden; flex-shrink: 0;
  }
  .bd-qty-btn {
    width: 38px; height: 46px; background: var(--bg); border: none; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    color: var(--ink3); transition: all 0.18s;
  }
  .bd-qty-btn:hover:not(:disabled) { background: var(--border); color: var(--navy); }
  .bd-qty-btn:disabled { opacity: 0.35; cursor: not-allowed; }
  .bd-qty-num {
    width: 42px; text-align: center; font-size: 0.9rem; font-weight: 700; color: var(--navy);
    border-left: 1px solid var(--border); border-right: 1px solid var(--border);
  }
  .bd-add-btn {
    flex: 1; display: flex; align-items: center; justify-content: center; gap: 0.5rem;
    height: 46px; border-radius: 10px; border: none; cursor: pointer;
    font-family: 'Poppins', sans-serif; font-size: 0.85rem; font-weight: 700;
    background: linear-gradient(135deg, var(--navy), var(--navy-mid));
    color: #fff; transition: all 0.22s;
    box-shadow: 0 4px 14px rgba(15,30,66,0.2);
  }
  .bd-add-btn:hover { filter: brightness(1.1); transform: translateY(-1px); box-shadow: 0 8px 20px rgba(15,30,66,0.28); }
  .bd-add-btn.added { background: linear-gradient(135deg, var(--green), #15803d); box-shadow: 0 4px 14px rgba(22,163,74,0.28); }
  .bd-add-btn:disabled { opacity: 0.45; cursor: not-allowed; transform: none; box-shadow: none; }
  .bd-subtotal { font-size: 0.72rem; color: var(--ink4); }
  .bd-subtotal strong { color: var(--copper-dk); }

  /* Section label */
  .bd-section-lbl {
    font-size: 0.62rem; font-weight: 700; letter-spacing: 0.18em; text-transform: uppercase;
    color: var(--ink4); margin-bottom: 0.65rem;
    display: flex; align-items: center; gap: 0.6rem;
  }
  .bd-section-lbl::after { content: ''; flex: 1; height: 1px; background: var(--border); }

  /* Desc */
  .bd-desc { font-size: 0.88rem; line-height: 1.8; color: var(--ink2); }
  .bd-desc.clamp { display: -webkit-box; -webkit-line-clamp: 5; -webkit-box-orient: vertical; overflow: hidden; }
  .bd-desc-toggle {
    background: none; border: none; cursor: pointer;
    font-family: 'Poppins', sans-serif; font-size: 0.77rem; font-weight: 600;
    color: var(--copper-dk); padding: 0; margin-top: 0.45rem; display: block; transition: color 0.2s;
  }
  .bd-desc-toggle:hover { color: var(--copper); }
  .bd-desc-src { font-size: 0.63rem; color: var(--ink4); margin-top: 0.3rem; }

  /* Specs grid */
  .bd-specs-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.65rem; }
  @media (max-width: 600px) { .bd-specs-grid { grid-template-columns: repeat(2, 1fr); } }
  .bd-spec-card { background: var(--bg-card); border: 1px solid var(--border); border-radius: 10px; padding: 0.8rem 1rem; }
  .bd-sc-lbl { font-size: 0.58rem; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; color: var(--ink4); margin-bottom: 0.2rem; }
  .bd-sc-val { font-size: 0.84rem; font-weight: 700; color: var(--ink2); }

  /* Loading / Error */
  .bd-loading {
    min-height: 100vh; display: flex; align-items: center; justify-content: center;
    flex-direction: column; gap: 1rem; background: var(--bg); font-family: 'Poppins', sans-serif;
  }
  .bd-spinner {
    width: 36px; height: 36px; border: 3px solid var(--border-md);
    border-top-color: var(--navy); border-radius: 50%; animation: spin 0.7s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }
  .bd-loading-txt { font-size: 0.82rem; color: var(--ink3); }
  .bd-error {
    min-height: 100vh; display: flex; align-items: center; justify-content: center;
    flex-direction: column; gap: 1rem; font-family: 'Poppins', sans-serif;
    background: var(--bg); padding: 2rem; text-align: center;
  }
  .bd-error-icon {
    width: 64px; height: 64px; border-radius: 16px;
    background: linear-gradient(135deg, var(--navy), var(--navy-mid));
    display: flex; align-items: center; justify-content: center; color: #fff;
  }
  .bd-error-title { font-size: 1.2rem; font-weight: 700; }
  .bd-error-back {
    background: none; border: 1px solid var(--border-md); border-radius: 8px;
    padding: 0.55rem 1.25rem; cursor: pointer; font-family: 'Poppins', sans-serif;
    font-size: 0.82rem; font-weight: 600; color: var(--ink3); transition: all 0.2s;
  }
  .bd-error-back:hover { border-color: var(--navy); color: var(--navy); }
`

const formatPrice = (price) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price)

/* ─────────────────────────────────────────
   COMPONENT
───────────────────────────────────────── */
const BookDetail = () => {
  const { id }        = useParams()
  const navigate      = useNavigate()
  const { addToCart } = useCart()

  const [book,          setBook]         = useState(null)
  const [loading,       setLoading]      = useState(true)
  const [quantity,      setQuantity]     = useState(1)
  const [added,         setAdded]        = useState(false)
  const [wishlisted,    setWishlisted]   = useState(false)
  const [descOpen,      setDescOpen]     = useState(false)
  const [coverLoading,  setCoverLoading] = useState(true)

  useEffect(() => {
    api.get(`/books/${id}`)
      .then(({ data }) => setBook(data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [id])

  const { cover: gbCover, description: gbDesc, gbData } = useGoogleBooksData(
    book?.title,
    book?.author,
    !book?.coverImage,
    !book?.description
  )

  const coverSrc   = book?.coverImage || gbCover
  const descText   = book?.description || gbDesc
  const descFromGB = !book?.description && !!gbDesc

  const handleAddToCart = useCallback(() => {
    addToCart(book, quantity)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }, [book, quantity, addToCart])

  if (loading) return (
    <div className="bd-loading">
      <style>{styles}</style>
      <div className="bd-spinner" />
      <div className="bd-loading-txt">Memuat buku...</div>
    </div>
  )

  if (!book) return (
    <div className="bd-error">
      <style>{styles}</style>
      <div className="bd-error-icon"><BookOpen size={28} /></div>
      <div className="bd-error-title">Buku Tidak Ditemukan</div>
      <button className="bd-error-back" onClick={() => navigate('/books')}>← Kembali ke Katalog</button>
    </div>
  )

  const inStock = book.stock > 0

  const specs = [
    { label: 'ISBN',     value: book.isbn      || '—' },
    { label: 'Penerbit', value: book.publisher || gbData?.publisher  || '—' },
    { label: 'Tahun',    value: book.year      || gbData?.publishedAt || '—' },
    { label: 'Halaman',  value: book.pageCount || gbData?.pageCount  || '—' },
    { label: 'Bahasa',   value: book.language  || gbData?.language   || 'Indonesia' },
    { label: 'Stok',     value: `${book.stock} eks` },
  ]

  const rating = gbData?.rating || 4.0
  const ratingCount = gbData?.ratingsCount || 0

  return (
    <div className="bd-root">
      <style>{styles}</style>

      {/* NAV */}
      <nav className="bd-nav">
        <Link to="/">Beranda</Link>
        <ChevronRight size={12} className="bd-nav-sep" />
        <Link to="/books">Katalog</Link>
        <ChevronRight size={12} className="bd-nav-sep" />
        <span className="bd-nav-cur">{book.title}</span>
        <button className="bd-back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={13} /> Kembali
        </button>
      </nav>

      {/* MAIN */}
      <div className="bd-main">

        {/* ── LEFT ── */}
        <div className="bd-left">
          <div className="bd-cover-wrap">
            {coverSrc ? (
              <>
                {coverLoading && <div className="bd-cover-shimmer" />}
                <img
                  src={coverSrc} alt={book.title}
                  className="bd-cover-img"
                  onLoad={() => setCoverLoading(false)}
                  onError={() => setCoverLoading(false)}
                />
              </>
            ) : (
              <div className="bd-cover-ph">
                <BookOpen size={40} />
                <div className="bd-cover-ph-title">{book.title}</div>
              </div>
            )}
          </div>

          <div className="bd-left-actions">
            <button
              className={`bd-action-btn ${wishlisted ? 'active' : ''}`}
              onClick={() => setWishlisted(w => !w)}
            >
              <Heart size={14} fill={wishlisted ? 'currentColor' : 'none'} />
              {wishlisted ? 'Disimpan' : 'Simpan'}
            </button>
            <button
              className="bd-action-btn"
              onClick={() => navigator.share?.({ title: book.title, url: window.location.href })}
            >
              <Share2 size={14} /> Bagikan
            </button>
          </div>

          <div className="bd-spec-table">
            {specs.map(({ label, value }) => (
              <div key={label} className="bd-spec-row">
                <span className="bd-spec-label">{label}</span>
                <span className="bd-spec-val">{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── RIGHT ── */}
        <div className="bd-right">

          <div className="bd-eyebrow">
            {book.category?.name && <span className="bd-cat-badge">{book.category.name}</span>}
            <div className="bd-rating">
              <div className="bd-stars">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={12} fill={i < Math.round(rating) ? 'currentColor' : 'none'} />
                ))}
              </div>
              {rating.toFixed(1)}
              {ratingCount > 0 && <span>· {ratingCount.toLocaleString('id-ID')} ulasan</span>}
            </div>
          </div>

          <div>
            <h1 className="bd-title">{book.title}</h1>
            <p className="bd-author">oleh <strong>{book.author}</strong></p>
          </div>

          {/* Purchase */}
          <div className="bd-purchase-box">
            <div className="bd-price-row">
              <div>
                <div className="bd-price-lbl">Harga</div>
                <div className="bd-price">{formatPrice(book.price)}</div>
              </div>
              <div className={`bd-stock-pill ${inStock ? 'in' : 'out'}`}>
                <div className="bd-stock-dot" />
                {inStock ? `Tersedia · ${book.stock} eks` : 'Stok Habis'}
              </div>
            </div>

            {inStock ? (
              <>
                <div className="bd-cta-row">
                  <div className="bd-qty">
                    <button className="bd-qty-btn" onClick={() => setQuantity(q => Math.max(1, q - 1))} disabled={quantity <= 1}>
                      <Minus size={14} />
                    </button>
                    <span className="bd-qty-num">{quantity}</span>
                    <button className="bd-qty-btn" onClick={() => setQuantity(q => Math.min(book.stock, q + 1))} disabled={quantity >= book.stock}>
                      <Plus size={14} />
                    </button>
                  </div>
                  <button className={`bd-add-btn ${added ? 'added' : ''}`} onClick={handleAddToCart}>
                    {added
                      ? <><Check size={16} /> Ditambahkan!</>
                      : <><ShoppingCart size={16} /> Tambah ke Keranjang</>
                    }
                  </button>
                </div>
                <div className="bd-subtotal">
                  Subtotal: <strong>{formatPrice(book.price * quantity)}</strong> untuk {quantity} eksemplar
                </div>
              </>
            ) : (
              <button className="bd-add-btn" disabled>
                <ShoppingCart size={16} /> Stok Habis
              </button>
            )}
          </div>

          {/* Description */}
          {descText && (
            <div>
              <div className="bd-section-lbl">Deskripsi</div>
              <p className={`bd-desc ${descOpen ? '' : 'clamp'}`}>{descText}</p>
              <button className="bd-desc-toggle" onClick={() => setDescOpen(o => !o)}>
                {descOpen ? 'Tampilkan lebih sedikit ↑' : 'Baca selengkapnya ↓'}
              </button>
              {descFromGB && <div className="bd-desc-src">Deskripsi dari Google Books</div>}
            </div>
          )}

          {/* Specs */}
          <div>
            <div className="bd-section-lbl">Informasi Buku</div>
            <div className="bd-specs-grid">
              {specs.map(({ label, value }) => (
                <div key={label} className="bd-spec-card">
                  <div className="bd-sc-lbl">{label}</div>
                  <div className="bd-sc-val">{value}</div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default BookDetail