# SweetMerry Backend API

Backend API untuk sistem pemesanan kue dan catering SweetMerry.

## Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **PostgreSQL** - Database
- **Prisma** - ORM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **express-validator** - Input validation

## Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Setup environment variables**
   ```bash
   cp env.example .env
   ```
   Edit `.env` file dengan konfigurasi database dan JWT secret Anda.

3. **Setup database**
   ```bash
   npm run db:generate
   npm run db:push
   npm run db:seed
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register user baru
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Products
- `GET /api/products` - Get semua produk
- `GET /api/products/:id` - Get produk by ID
- `POST /api/products` - Create produk (admin only)
- `PUT /api/products/:id` - Update produk (admin only)
- `DELETE /api/products/:id` - Delete produk (admin only)

### Orders
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
- `createdAt`
- `updatedAt`

### Product
- `id` (Primary Key)
- `name`
- `description`
- `price`
- `category`
- `isAvailable`
- `createdAt`
- `updatedAt`

### Order
- `id` (Primary Key)
- `userId` (Foreign Key)
- `productId` (Foreign Key)
- `date`
- `time`
- `status` (PENDING/CONFIRMED/CANCELLED/COMPLETED)
- `createdAt`
- `updatedAt`

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

## Authentication

API menggunakan JWT token. Setelah login/register, simpan token dan kirim dalam header:
```
Authorization: Bearer <your-token>
```
