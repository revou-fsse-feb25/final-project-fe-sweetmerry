# SweetMerry - Sistem Pemesanan Kue & Catering

## Deskripsi Proyek
SweetMerry adalah sistem manajemen pemesanan untuk layanan kue dan catering. Pengguna dapat memesan berbagai jenis kue, makanan, dan layanan catering dengan mudah. Sistem ini memenuhi semua persyaratan CRACK Final Project dengan implementasi full-stack yang lengkap.

## Fitur Utama
- **Autentikasi & Otorisasi**: Daftar, login, dan role-based access (User/Admin)
- **Manajemen Produk**: Admin dapat menambah/edit/hapus produk
- **Pemesanan**: Pengguna dapat memesan produk dengan pilihan tanggal/waktu
- **Dashboard**: Tampilan riwayat pemesanan dan status
- **Pencarian**: Filter produk berdasarkan kategori dan nama
- **Status Pemesanan**: PENDING, CONFIRMED, CANCELLED, COMPLETED

## Tech Stack

### Frontend
- **React.js** - UI Framework
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **Axios** - HTTP Client

### Backend
- **Node.js** - Runtime Environment
- **Express.js** - Web Framework
- **PostgreSQL** - Database
- **Prisma** - ORM
- **JWT** - Authentication
- **bcryptjs** - Password Hashing
- **express-validator** - Input Validation

## Instalasi & Penggunaan

### Prerequisites
- Node.js (v16+)
- PostgreSQL
- Git

### Frontend Setup
```bash
cd frontend
npm install
npm start
```
Frontend akan berjalan di: http://localhost:3000

### Backend Setup
```bash
cd backend
npm install

# Setup environment variables
cp env.example .env
# Edit .env dengan konfigurasi database Anda

# Setup database
npm run db:generate
npm run db:push
npm run db:seed

# Start server
npm run dev
```
Backend akan berjalan di: http://localhost:5000

## API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - Register user baru
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Products Endpoints
- `GET /api/products` - Get semua produk
- `GET /api/products/:id` - Get produk by ID
- `POST /api/products` - Create produk (admin only)
- `PUT /api/products/:id` - Update produk (admin only)
- `DELETE /api/products/:id` - Delete produk (admin only)

### Orders Endpoints
- `GET /api/orders/my-orders` - Get user orders (protected)
- `GET /api/orders` - Get semua orders (admin only)
- `POST /api/orders` - Create order baru (protected)
- `PUT /api/orders/:id/status` - Update order status (admin only)
- `PUT /api/orders/:id/cancel` - Cancel order (protected)

## Database Schema

### User
- `id` (Primary Key)
- `email` (Unique)
- `password` (Hashed)
- `name`
- `role` (USER/ADMIN)
- `createdAt`, `updatedAt`

### Product
- `id` (Primary Key)
- `name`
- `description`
- `price`
- `category`
- `isAvailable`
- `createdAt`, `updatedAt`

### Order
- `id` (Primary Key)
- `userId` (Foreign Key)
- `productId` (Foreign Key)
- `date`
- `time`
- `status` (PENDING/CONFIRMED/CANCELLED/COMPLETED)
- `createdAt`, `updatedAt`

## Sample Data

Setelah menjalankan seed, Anda akan memiliki:

**Admin User:**
- Email: `admin@sweetmerry.com`
- Password: `admin123`

**Regular User:**
- Email: `user@sweetmerry.com`
- Password: `user123`

**Sample Products:**
- Kue Cokelat Premium (Rp 150.000)
- Kue Keju Lembut (Rp 130.000)
- Paket Snack Box A (Rp 25.000)
- Paket Nasi Kotak B (Rp 35.000)
- Tumpeng Mini (Rp 75.000)

## Fitur CRACK yang Diimplementasi

### ✅ Autentikasi & Otorisasi
- JWT-based authentication
- Role-based authorization (User/Admin)
- Protected routes

### ✅ Manajemen Konten/Layanan
- Admin CRUD untuk produk
- Validasi input
- Status produk (available/unavailable)

### ✅ Alur Interaksi Pengguna
- User dapat memesan produk
- Pilihan tanggal dan waktu
- Konfirmasi pemesanan

### ✅ Pelacakan & Status
- Status pemesanan real-time
- Riwayat pemesanan user
- Dashboard admin untuk monitoring

### ✅ Aksi Perbarui atau Batalkan
- User dapat cancel pesanan sendiri
- Admin dapat update status pesanan
- Validasi akses berdasarkan role

### ✅ Jelajah & Cari
- Filter produk berdasarkan nama
- Kategori produk
- Tampilan produk yang tersedia

### ✅ Dashboard
- User dashboard: riwayat pesanan
- Admin dashboard: kelola produk & pesanan
- Statistik dan monitoring

## Deployment

### Frontend (Vercel/Netlify)
```bash
cd frontend
npm run build
# Deploy folder build/
```

### Backend (Render/Railway)
```bash
cd backend
# Set environment variables
npm start
```

## Repository Structure
```
final-project-fe-sweetmerry/
├── frontend/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/          # Page components
│   │   └── sampleData/     # Mock data
│   └── package.json
├── backend/                 # Express backend
│   ├── middleware/         # Auth middleware
│   ├── routes/            # API routes
│   ├── prisma/           # Database schema & seed
│   └── server.js         # Main server file
└── README.md
```

## Contributing
1. Fork repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## License
MIT License
