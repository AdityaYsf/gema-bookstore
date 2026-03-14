<div align="center">

# 📚 Gema Bookstore

**Platform e-commerce buku full-stack dengan sistem pembayaran terintegrasi**

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

</div>

---

## 📋 Daftar Isi

- [Tentang Proyek](#-tentang-proyek)
- [Fitur](#-fitur)
- [Tech Stack](#-tech-stack)
- [Struktur Proyek](#-struktur-proyek)
- [Prasyarat](#-prasyarat)
- [Instalasi & Konfigurasi](#-instalasi--konfigurasi)
- [Menjalankan Aplikasi](#-menjalankan-aplikasi)
- [API Endpoints](#-api-endpoints)
- [Database Schema](#-database-schema)
- [Variabel Lingkungan](#-variabel-lingkungan)

---

## 🧾 Tentang Proyek

**Gema Bookstore** adalah aplikasi e-commerce buku berbasis web yang dibangun dengan arsitektur **client-server** (monorepo). Aplikasi ini menyediakan pengalaman berbelanja buku yang lengkap — mulai dari pencarian buku, manajemen keranjang belanja, hingga proses checkout dengan pembayaran online melalui **Midtrans**. Dilengkapi juga dengan panel admin untuk mengelola data buku, pengguna, dan pesanan.

---

## ✨ Fitur

### 👤 Pengguna (User)
- Registrasi dan login dengan autentikasi JWT
- Jelajahi dan cari buku berdasarkan kategori
- Lihat detail buku (judul, penulis, penerbit, harga, stok)
- Tambah buku ke keranjang belanja
- Proses checkout dengan pembayaran via **Midtrans Snap**
- Riwayat pesanan pribadi
- Pencarian buku dari **Google Books API**

### 🔐 Admin
- Dashboard statistik (penjualan, pendapatan, pengguna)
- Manajemen buku (tambah, edit, hapus, upload cover)
- Manajemen pengguna
- Manajemen & pemantauan status pesanan

---

## 🛠 Tech Stack

### Backend
| Teknologi | Keterangan |
|---|---|
| **Node.js + Express** | REST API server |
| **Prisma ORM** | Query builder & database migration |
| **PostgreSQL** | Database relasional |
| **JWT (jsonwebtoken)** | Autentikasi & otorisasi |
| **Bcrypt.js** | Enkripsi password |
| **Midtrans Client** | Gateway pembayaran |
| **Multer** | Upload file (cover buku) |
| **Morgan** | HTTP request logger |

### Frontend
| Teknologi | Keterangan |
|---|---|
| **React 18** | UI library |
| **Vite** | Build tool & dev server |
| **React Router v6** | Client-side routing |
| **Axios** | HTTP client |
| **Tailwind CSS** | Utility-first CSS framework |
| **Lucide React** | Icon library |
| **Google Books API** | Pencarian buku eksternal |

---

## 📁 Struktur Proyek

```
gema-bookstore/
├── client/                     # Frontend (React + Vite)
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Auth/           # ProtectedRoute, AdminRoute
│   │   │   ├── Layout/         # Navbar, Footer, ScrollToTop
│   │   │   └── googleBooksSearch/
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   └── CartContext.jsx
│   │   ├── pages/
│   │   │   ├── Home/
│   │   │   ├── Books/          # Daftar & detail buku
│   │   │   ├── Cart/
│   │   │   ├── Login/ & Register/
│   │   │   ├── MyOrders/
│   │   │   ├── OrderSuccess/
│   │   │   └── Admin/          # Dashboard, Books, Users, Orders
│   │   ├── services/
│   │   │   ├── api.js          # Axios instance & API calls
│   │   │   └── googleBooks.js
│   │   └── App.jsx
│   ├── .env
│   └── vite.config.js
│
└── server/                     # Backend (Node.js + Express)
    ├── prisma/
    │   ├── schema.prisma
    │   └── migrations/
    ├── src/
    │   ├── config/
    │   │   └── database.js     # Prisma client instance
    │   ├── controllers/        # authController, bookController, dll.
    │   ├── middleware/
    │   │   ├── auth.js         # JWT middleware
    │   │   └── errorHandler.js
    │   ├── routes/             # auth, books, categories, cart, orders, admin
    │   └── app.js              # Entry point
    ├── seed.js                 # Database seeder
    └── .env.example
```

---

## ✅ Prasyarat

Pastikan perangkat Anda telah terinstal:

- **Node.js** v18 atau lebih baru
- **npm** v9 atau lebih baru
- **PostgreSQL** v14 atau lebih baru
- Akun **Midtrans** (untuk fitur pembayaran)

---

## ⚙️ Instalasi & Konfigurasi

### 1. Clone Repository

```bash
git clone https://github.com/username/gema-bookstore.git
cd gema-bookstore
```

### 2. Konfigurasi Backend

```bash
cd server
npm install
```

Salin file environment dan isi nilainya:

```bash
cp .env.example .env
```

Edit file `.env`:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/bookstore_db?schema=public"

# JWT
JWT_SECRET="your-super-secret-jwt-key"
JWT_EXPIRES_IN="7d"

# Server
PORT=5000
NODE_ENV=development

# Midtrans
MIDTRANS_SERVER_KEY="your-midtrans-server-key"
MIDTRANS_CLIENT_KEY="your-midtrans-client-key"

# File Upload
UPLOAD_DIR="uploads/"
MAX_FILE_SIZE=5242880
```

### 3. Setup Database

```bash
# Generate Prisma client
npm run db:generate

# Jalankan migrasi
npm run db:migrate

# (Opsional) Isi data awal
npm run db:seed
```

### 4. Konfigurasi Frontend

```bash
cd ../client
npm install
```

Buat file `.env` di folder `client/`:

```env
VITE_API_URL=http://localhost:5000/api
VITE_GOOGLE_BOOKS_API_KEY=your-google-books-api-key
VITE_MIDTRANS_CLIENT_KEY=your-midtrans-client-key
```

---

## ▶️ Menjalankan Aplikasi

Buka **dua terminal** secara bersamaan:

**Terminal 1 — Backend:**
```bash
cd server
npm run dev
# Server berjalan di http://localhost:5000
```

**Terminal 2 — Frontend:**
```bash
cd client
npm run dev
# Aplikasi berjalan di http://localhost:5173
```

---

## 📡 API Endpoints

### Auth
| Method | Endpoint | Deskripsi | Auth |
|--------|----------|-----------|------|
| `POST` | `/api/auth/register` | Registrasi pengguna baru | ❌ |
| `POST` | `/api/auth/login` | Login & dapatkan token JWT | ❌ |

### Books
| Method | Endpoint | Deskripsi | Auth |
|--------|----------|-----------|------|
| `GET` | `/api/books` | Ambil semua buku | ❌ |
| `GET` | `/api/books/:id` | Detail buku | ❌ |
| `POST` | `/api/books` | Tambah buku | Admin |
| `PUT` | `/api/books/:id` | Edit buku | Admin |
| `DELETE` | `/api/books/:id` | Hapus buku | Admin |

### Categories
| Method | Endpoint | Deskripsi | Auth |
|--------|----------|-----------|------|
| `GET` | `/api/categories` | Ambil semua kategori | ❌ |
| `POST` | `/api/categories` | Tambah kategori | Admin |

### Cart
| Method | Endpoint | Deskripsi | Auth |
|--------|----------|-----------|------|
| `GET` | `/api/cart` | Lihat keranjang | ✅ User |
| `POST` | `/api/cart` | Tambah item ke keranjang | ✅ User |
| `PUT` | `/api/cart/:id` | Update kuantitas item | ✅ User |
| `DELETE` | `/api/cart/:id` | Hapus item dari keranjang | ✅ User |

### Orders
| Method | Endpoint | Deskripsi | Auth |
|--------|----------|-----------|------|
| `POST` | `/api/orders` | Buat pesanan baru | ✅ User |
| `GET` | `/api/orders/my-orders` | Riwayat pesanan user | ✅ User |
| `POST` | `/api/orders/notification` | Webhook Midtrans | ❌ |

### Admin
| Method | Endpoint | Deskripsi | Auth |
|--------|----------|-----------|------|
| `GET` | `/api/admin/dashboard` | Statistik dashboard | Admin |
| `GET` | `/api/admin/users` | Kelola pengguna | Admin |
| `GET` | `/api/admin/orders` | Kelola semua pesanan | Admin |

---

## 🗄️ Database Schema

```
User ──────┬──── Cart ────── CartItem ───── Book ──── Category
           │                                  │
           └──── Order ─── OrderItem ─────────┘
                   │
                   └──── RevenueTransaction
```

**Model Utama:**
- **User** — Data akun pengguna dengan role `USER` / `ADMIN`
- **Book** — Katalog buku lengkap dengan stok dan harga
- **Category** — Kategori buku
- **Cart / CartItem** — Keranjang belanja per pengguna
- **Order / OrderItem** — Pesanan dengan status: `PENDING` → `PROCESSING` → `SHIPPED` → `DELIVERED` / `CANCELLED`
- **RevenueTransaction** — Catatan transaksi pendapatan & pengeluaran

---

## 🔐 Variabel Lingkungan

### Server (`server/.env`)

| Variabel | Keterangan | Contoh |
|---|---|---|
| `DATABASE_URL` | Connection string PostgreSQL | `postgresql://user:pass@localhost:5432/db` |
| `JWT_SECRET` | Secret key untuk JWT | `your-secret-key` |
| `JWT_EXPIRES_IN` | Masa berlaku token | `7d` |
| `PORT` | Port server | `5000` |
| `NODE_ENV` | Environment | `development` |
| `MIDTRANS_SERVER_KEY` | Server key Midtrans | `SB-Mid-server-...` |
| `MIDTRANS_CLIENT_KEY` | Client key Midtrans | `SB-Mid-client-...` |

### Client (`client/.env`)

| Variabel | Keterangan |
|---|---|
| `VITE_API_URL` | Base URL backend API |
| `VITE_GOOGLE_BOOKS_API_KEY` | API key Google Books |
| `VITE_MIDTRANS_CLIENT_KEY` | Client key Midtrans (untuk Snap.js) |

---

## 📜 Lisensi

Proyek ini dibuat untuk keperluan pembelajaran. Silakan digunakan dan dimodifikasi sesuai kebutuhan.

---

<div align="center">
  <p>Dibuat dengan ❤️ menggunakan React & Node.js</p>
</div>
