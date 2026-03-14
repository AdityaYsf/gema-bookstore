// src/services/googleBooks.js
// Service layer untuk Google Books API
// Docs: https://developers.google.com/books/docs/v1/using

const API_KEY = import.meta.env.VITE_GOOGLE_BOOKS_API_KEY
const BASE_URL = 'https://www.googleapis.com/books/v1'

// Helper: normalisasi data dari Google Books 
// Google Books API mengembalikan struktur yang kompleks dan
// tidak konsisten — fungsi ini menyederhanakannya
export const normalizeBook = (item) => {
  const info = item.volumeInfo || {}

  return {
    googleId:    item.id,
    title:       info.title || 'Judul tidak tersedia',
    authors:     info.authors || ['Penulis tidak diketahui'],
    author:      info.authors ? info.authors.join(', ') : 'Penulis tidak diketahui',
    publisher:   info.publisher || null,
    publishedAt: info.publishedDate || null,
    year:        info.publishedDate ? info.publishedDate.substring(0, 4) : null,
    description: info.description || null,
    pageCount:   info.pageCount || null,
    categories:  info.categories || [],
    language:    info.language || null,
    isbn:        info.industryIdentifiers?.find(i => i.type === 'ISBN_13')?.identifier
              || info.industryIdentifiers?.find(i => i.type === 'ISBN_10')?.identifier
              || null,
    // Cover: gunakan HTTPS dan ukuran terbesar yang tersedia
    coverImage:  getCoverImage(info.imageLinks),
    previewLink: info.previewLink || null,
    infoLink:    info.infoLink || null,
    rating:      info.averageRating || null,
    ratingsCount: info.ratingsCount || 0,
  }
}

// Ambil cover image terbaik dan pastikan HTTPS
const getCoverImage = (imageLinks) => {
  if (!imageLinks) return null
  const url = imageLinks.extraLarge
    || imageLinks.large
    || imageLinks.medium
    || imageLinks.thumbnail
    || imageLinks.smallThumbnail
    || null
  // Google kadang return HTTP — paksa jadi HTTPS
  return url ? url.replace('http://', 'https://') : null
}

// Search buku
// q        : query pencarian (judul, penulis, ISBN)
// options  : { maxResults, startIndex, langRestrict, orderBy }
export const searchBooks = async (q, options = {}) => {
  if (!q?.trim()) return { books: [], total: 0 }

  const {
    maxResults   = 12,
    startIndex   = 0,
    langRestrict = null,  // 'id' untuk Bahasa Indonesia
    orderBy      = 'relevance', // 'relevance' | 'newest'
  } = options

  const params = new URLSearchParams({
    q: q.trim(),
    maxResults,
    startIndex,
    orderBy,
    printType: 'books',
    key: API_KEY,
  })

  if (langRestrict) params.set('langRestrict', langRestrict)

  try {
    const res = await fetch(`${BASE_URL}/volumes?${params}`)
    if (!res.ok) throw new Error(`Google Books API error: ${res.status}`)
    const data = await res.json()

    return {
      books: (data.items || []).map(normalizeBook),
      total: data.totalItems || 0,
    }
  } catch (err) {
    console.error('searchBooks error:', err)
    throw err
  }
}

//Cari buku berdasarkan kategori / subject 
export const searchByCategory = async (category, options = {}) => {
  return searchBooks(`subject:${category}`, options)
}

//Cari buku berdasarkan penulis
export const searchByAuthor = async (author, options = {}) => {
  return searchBooks(`inauthor:${author}`, options)
}

//Cari buku berdasarkan ISBN
export const searchByISBN = async (isbn, options = {}) => {
  return searchBooks(`isbn:${isbn}`, options)
}

//Ambil detail 1 buku by Google ID
export const getBookById = async (googleId) => {
  try {
    const res = await fetch(`${BASE_URL}/volumes/${googleId}?key=${API_KEY}`)
    if (!res.ok) throw new Error(`Google Books API error: ${res.status}`)
    const data = await res.json()
    return normalizeBook(data)
  } catch (err) {
    console.error('getBookById error:', err)
    throw err
  }
}

//Buku terbaru / terlaris per kategori
export const getFeaturedBooks = async (query = 'programming', maxResults = 8) => {
  return searchBooks(query, { maxResults, orderBy: 'newest' })
}