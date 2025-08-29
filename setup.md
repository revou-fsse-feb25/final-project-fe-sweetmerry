# SweetMerry Project Setup Guide

## Prerequisites

- Node.js (v18 or newer)
- PostgreSQL database
- npm or yarn package manager

## Quick Start

### 1. Clone the Repository
```bash
git clone <repository-url>
cd final-project-fe-sweetmerry
```

### 2. Backend Setup

#### Install Dependencies
```bash
cd backend
npm install
```

#### Environment Configuration
1. Copy the example environment file:
```bash
cp env.example .env
```

2. Update the `.env` file with your database credentials:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/sweetmerry_db"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
PORT=5000
NODE_ENV=development
CORS_ORIGIN="http://localhost:3000"
```

#### Database Setup
1. Create a PostgreSQL database named `sweetmerry_db`
2. Run Prisma migrations:
```bash
npx prisma generate
npx prisma db push
```

3. Seed the database with sample data:
```bash
npm run seed
```

#### Start Backend Server
```bash
npm run dev
```

The backend will be running at `http://localhost:5000`

### 3. Frontend Setup

#### Install Dependencies
```bash
cd ../frontend
npm install
```

#### Environment Configuration
Create a `.env` file in the frontend directory:
```env
VITE_API_URL=http://localhost:5000/api
```

#### Start Frontend Development Server
```bash
npm run dev
```

The frontend will be running at `http://localhost:3000`

## Demo Credentials

### Admin User
- Email: admin@sweetmerry.com
- Password: admin123

### Regular User
- Email: user@sweetmerry.com
- Password: user123

## Project Structure

```
final-project-fe-sweetmerry/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── services.js
│   │   ├── bookings.js
│   │   └── users.js
│   ├── middleware/
│   │   └── auth.js
│   ├── index.js
│   ├── package.json
│   └── API_DOCUMENTATION.md
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── contexts/
│   │   ├── pages/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## Available Scripts

### Backend
- `npm run dev` - Start development server
- `npm start` - Start production server
- `npm run seed` - Seed database with sample data

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Features Implemented

### Backend
- ✅ User authentication (register/login)
- ✅ JWT token-based authorization
- ✅ Role-based access control (USER/ADMIN)
- ✅ CRUD operations for services
- ✅ CRUD operations for bookings
- ✅ User management (admin only)
- ✅ Input validation and error handling
- ✅ Database schema with Prisma ORM
- ✅ Sample data seeding

### Frontend
- ✅ React application with Vite
- ✅ Tailwind CSS for styling
- ✅ React Router for navigation
- ✅ Authentication context
- ✅ Protected routes
- ✅ Responsive design
- ✅ Login and registration forms
- ✅ Dashboard with user statistics
- ✅ Placeholder pages for all features

## Next Steps

1. **Complete Frontend Features:**
   - Implement Services page with filtering and search
   - Implement Service Detail page with booking form
   - Implement Bookings page with management options
   - Implement Profile page with user settings
   - Implement Admin Dashboard with statistics
   - Implement Admin Services management
   - Implement Admin Bookings management
   - Implement Admin Users management

2. **Add Advanced Features:**
   - Email notifications
   - File upload for service images
   - Real-time notifications
   - Payment integration
   - Advanced search and filtering
   - Export functionality

3. **Deployment:**
   - Deploy backend to Render/Railway
   - Deploy frontend to Vercel/Netlify
   - Set up production database
   - Configure environment variables

## Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Ensure PostgreSQL is running
   - Check database credentials in `.env`
   - Verify database exists

2. **Port Already in Use**
   - Change port in `.env` file
   - Kill existing processes using the port

3. **CORS Errors**
   - Ensure CORS_ORIGIN in backend `.env` matches frontend URL
   - Check that both servers are running

4. **Authentication Issues**
   - Clear browser localStorage
   - Check JWT_SECRET in backend `.env`
   - Verify token expiration

## Support

For issues and questions, please refer to the API documentation in `backend/API_DOCUMENTATION.md` or create an issue in the repository.
