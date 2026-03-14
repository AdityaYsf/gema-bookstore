// src/components/Books/GoogleBooksSearch.jsx
import { useState, useEffect, useRef } from 'react'
import { Search, BookOpen, ExternalLink, Star, X, ChevronDown } from 'lucide-react'
import { searchBooks } from '../../services/googleBooks'

const styles = `
  .gb-wrap { font-family: 'Poppins', sans-serif; }
  .gb-search-bar {
    display: flex; align-items: center; gap: 0.75rem;
    background: #fff; border: 2px solid rgba(15,30,66,0.12);
    border-radius: 12px; padding: 0.65rem 1rem;
    transition: border-color 0.2s, box-shadow 0.2s; margin-bottom: 1.5rem;
  }
  .gb-search-bar:focus-within { border-color: #d4823a; box-shadow: 0 0 0 3px rgba(212,130,58,0.12); }
  .gb-search-bar input { flex: 1; border: none; outline: none; font-family: 'Poppins', sans-serif; font-size: 0.9rem; color: #0f1e42; background: transparent; }
  .gb-search-bar input::placeholder { color: #9aa3c2; }
  .gb-clear-btn { background: none; border: none; cursor: pointer; color: #9aa3c2; display: flex; align-items: center; padding: 0; transition: color 0.2s; }
  .gb-clear-btn:hover { color: #0f1e42; }
  .gb-meta { font-size: 0.75rem; color: #6272a0; margin-bottom: 1rem; }
  .gb-meta strong { color: #b06828; }
  .gb-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 1rem; margin-bottom: 1.5rem; }
  .gb-card { background: #fff; border: 1px solid rgba(15,30,66,0.08); border-radius: 12px; overflow: hidden; transition: transform 0.25s, box-shadow 0.25s, border-color 0.25s; }
  .gb-card:hover { transform: translateY(-4px); box-shadow: 0 12px 28px rgba(15,30,66,0.12); border-color: rgba(212,130,58,0.3); }
  .gb-card-cover { width: 100%; aspect-ratio: 2/3; object-fit: cover; display: block; background: #eef1fb; }
  .gb-card-cover-ph { width: 100%; aspect-ratio: 2/3; background: linear-gradient(135deg,#dde4f5,#eef1fb); display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 0.5rem; color: #9aa3c2; font-size: 0.65rem; text-align: center; padding: 1rem; }
  .gb-card-body { padding: 0.75rem; }
  .gb-card-title { font-size: 0.78rem; font-weight: 700; color: #0f1e42; line-height: 1.35; margin-bottom: 0.25rem; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
  .gb-card-author { font-size: 0.68rem; color: #6272a0; margin-bottom: 0.35rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .gb-card-meta { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.3rem; }
  .gb-card-year { font-size: 0.62rem; font-weight: 600; background: #eef1fb; color: #6272a0; padding: 0.1rem 0.45rem; border-radius: 100px; }
  .gb-card-rating { display: flex; align-items: center; gap: 0.2rem; font-size: 0.62rem; color: #d97706; font-weight: 600; }
  .gb-card-preview { display: flex; align-items: center; gap: 0.3rem; font-size: 0.65rem; color: #b06828; font-weight: 600; text-decoration: none; margin-top: 0.5rem; padding-top: 0.5rem; border-top: 1px solid rgba(15,30,66,0.06); transition: color 0.2s; }
  .gb-card-preview:hover { color: #d4823a; }
  .gb-skel { background: #fff; border: 1px solid rgba(15,30,66,0.08); border-radius: 12px; overflow: hidden; }
  .gb-skel-cover { width: 100%; aspect-ratio: 2/3; background: #eef1fb; position: relative; overflow: hidden; }
  .gb-skel-body { padding: 0.75rem; display: flex; flex-direction: column; gap: 0.4rem; }
  .gb-skel-bar { background: #eef1fb; border-radius: 4px; position: relative; overflow: hidden; }
  .gb-skel-cover::after, .gb-skel-bar::after { content: ''; position: absolute; inset: 0; background: linear-gradient(90deg,transparent,rgba(255,255,255,0.8),transparent); animation: gbShimmer 1.4s infinite; }
  @keyframes gbShimmer { from{transform:translateX(-100%)} to{transform:translateX(100%)} }
  .gb-empty { text-align: center; padding: 3rem 1rem; color: #6272a0; }
  .gb-empty-icon { width: 56px; height: 56px; border-radius: 14px; margin: 0 auto 1rem; background: linear-gradient(135deg,#0f1e42,#1a2f5e); display: flex; align-items: center; justify-content: center; color: #fff; }
  .gb-empty-title { font-size: 1rem; font-weight: 700; color: #0f1e42; margin-bottom: 0.35rem; }
  .gb-empty-desc { font-size: 0.8rem; }
  .gb-load-more { width: 100%; padding: 0.75rem; background: #eef1fb; border: 1px solid rgba(15,30,66,0.1); border-radius: 9px; cursor: pointer; font-family: 'Poppins', sans-serif; font-size: 0.83rem; font-weight: 600; color: #3a4a6e; display: flex; align-items: center; justify-content: center; gap: 0.5rem; transition: all 0.22s; }
  .gb-load-more:hover { background: #dde4f5; }
  .gb-load-more:disabled { opacity: 0.5; cursor: not-allowed; }
  .gb-powered { text-align: center; font-size: 0.62rem; color: #9aa3c2; margin-top: 1rem; }
  .gb-powered a { color: inherit; }
`

const SkeletonCard = () => (
  <div className="gb-skel">
    <div className="gb-skel-cover" />
    <div className="gb-skel-body">
      <div className="gb-skel-bar" style={{ height: 11, width: '90%' }} />
      <div className="gb-skel-bar" style={{ height: 11, width: '70%' }} />
      <div className="gb-skel-bar" style={{ height: 9, width: '45%' }} />
    </div>
  </div>
)

const GBookCard = ({ book }) => (
  <div className="gb-card">
    {book.coverImage
      ? <img src={book.coverImage} alt={book.title} className="gb-card-cover" loading="lazy"
          onError={(e) => { e.target.style.display='none'; e.target.nextSibling.style.display='flex' }} />
      : null}
    <div className="gb-card-cover-ph" style={{ display: book.coverImage ? 'none' : 'flex' }}>
      <BookOpen size={24} /><span>{book.title}</span>
    </div>
    <div className="gb-card-body">
      <div className="gb-card-title">{book.title}</div>
      <div className="gb-card-author">{book.author}</div>
      <div className="gb-card-meta">
        {book.publishedDate && <span className="gb-card-year">{book.publishedDate}</span>}
        {book.rating && <span className="gb-card-rating"><Star size={9} fill="currentColor" /> {book.rating.toFixed(1)}</span>}
      </div>
      {book.previewLink && (
        <a href={book.previewLink} target="_blank" rel="noopener noreferrer"
          className="gb-card-preview" onClick={e => e.stopPropagation()}>
          <ExternalLink size={10} /> Preview Google Books
        </a>
      )}
    </div>
  </div>
)

const GoogleBooksSearch = ({
  placeholder   = 'Cari judul, penulis, atau ISBN...',
  defaultQuery  = '',
  showPoweredBy = true,
}) => {
  const [query,       setQuery]       = useState(defaultQuery)
  const [books,       setBooks]       = useState([])
  const [loading,     setLoading]     = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [totalItems,  setTotalItems]  = useState(0)
  const [startIndex,  setStartIndex]  = useState(0)
  const debounceRef = useRef(null)
  const PAGE_SIZE = 12

  useEffect(() => {
    if (!query.trim()) { setBooks([]); setTotalItems(0); return }
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => doSearch(query, 0, false), 500)
    return () => clearTimeout(debounceRef.current)
  }, [query])

  useEffect(() => { if (defaultQuery) doSearch(defaultQuery, 0, false) }, [])

  const doSearch = async (q, idx, append) => {
    try {
      append ? setLoadingMore(true) : setLoading(true)
      const result = await searchBooks(q, PAGE_SIZE, idx)
      setBooks(prev => append ? [...prev, ...result.books] : result.books)
      setTotalItems(result.totalItems)
      setStartIndex(idx + PAGE_SIZE)
    } catch (err) {
      console.error('Google Books error:', err)
    } finally {
      setLoading(false); setLoadingMore(false)
    }
  }

  const hasMore = books.length < totalItems && books.length > 0

  return (
    <div className="gb-wrap">
      <style>{styles}</style>
      <div className="gb-search-bar">
        <Search size={16} color="#9aa3c2" />
        <input type="text" placeholder={placeholder} value={query}
          onChange={e => setQuery(e.target.value)} autoComplete="off" />
        {query && <button className="gb-clear-btn" onClick={() => setQuery('')}><X size={14} /></button>}
      </div>
      {!loading && totalItems > 0 && (
        <div className="gb-meta">
          Menampilkan <strong>{books.length}</strong> dari <strong>{totalItems.toLocaleString('id-ID')}</strong> hasil untuk "{query}"
        </div>
      )}
      {loading && (
        <div className="gb-grid">{Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}</div>
      )}
      {!loading && books.length > 0 && (
        <>
          <div className="gb-grid">{books.map(book => <GBookCard key={book.googleId} book={book} />)}</div>
          {hasMore && (
            <button className="gb-load-more" onClick={() => doSearch(query, startIndex, true)} disabled={loadingMore}>
              {loadingMore ? 'Memuat...' : <><ChevronDown size={15} /> Muat Lebih Banyak</>}
            </button>
          )}
        </>
      )}
      {!loading && query && books.length === 0 && (
        <div className="gb-empty">
          <div className="gb-empty-icon"><BookOpen size={22} /></div>
          <div className="gb-empty-title">Buku tidak ditemukan</div>
          <div className="gb-empty-desc">Coba kata kunci yang berbeda</div>
        </div>
      )}
      {showPoweredBy && books.length > 0 && (
        <div className="gb-powered">
          Data buku dari <a href="https://books.google.com" target="_blank" rel="noopener noreferrer">Google Books API</a>
        </div>
      )}
    </div>
  )
}

export default GoogleBooksSearch