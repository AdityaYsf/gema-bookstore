require('dotenv').config()
const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const path = require('path')
const orderRoutes = require('./routes/orderRoutes')

const authRoutes = require('./routes/auth')
const bookRoutes = require('./routes/books')
const categoryRoutes = require('./routes/categories')
const cartRoutes = require('./routes/cart')
const adminRoutes = require('./routes/admin')
const errorHandler = require('./middleware/errorHandler')

const app = express()
const PORT = process.env.PORT || 5000

// ── CSP — harus dipasang SEBELUM routes ──────────────────────
app.use((req, res, next) => {
  res.setHeader(
    'Content-Security-Policy',
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-eval' https://*.midtrans.com https://*.veritrans.co.id https://app.sandbox.midtrans.com https://app.midtrans.com",
      "frame-src 'self' https://*.midtrans.com https://*.veritrans.co.id",
      "connect-src 'self' https://*.midtrans.com https://*.veritrans.co.id https://www.googleapis.com",
      "img-src 'self' data: https: blob:",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
    ].join('; ')
  )
  next()
})

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(morgan('dev'))

// Static files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')))

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/books', bookRoutes)
app.use('/api/categories', categoryRoutes)
app.use('/api/cart', cartRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/orders', require('./routes/orderRoutes'))

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() })
})

// Error handling
app.use(errorHandler)

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' })
})

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
  console.log(`📚 API Documentation: http://localhost:${PORT}/api/health`)
})

module.exports = app