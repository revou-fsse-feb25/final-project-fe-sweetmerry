# SweetMerry - Booking Management System

A complete booking management system built with React, Node.js, and PostgreSQL. This application allows users to browse services, make bookings, and manage their reservations, while administrators can manage services, users, and bookings.

## 🚀 Live Demo

- **Frontend**: [https://sweetmerry-frontend.onrender.com](https://sweetmerry-frontend.onrender.com)
- **Backend API**: [https://sweetmerry-backend.onrender.com](https://sweetmerry-backend.onrender.com)

## ✨ Features

### For Users
- 🔐 User authentication (register/login)
- 🔍 Browse and search services
- 📅 Make bookings with date/time selection
- 📋 View booking history and status
- ✏️ Edit or cancel bookings
- 👤 Profile management
- 📱 Responsive design

### For Administrators
- 📊 Dashboard with statistics
- 🛠️ Service management (CRUD operations)
- 👥 User management
- 📋 Booking management and status updates
- 📈 Analytics and reporting

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI framework
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **Axios** - HTTP client
- **Lucide React** - Icons

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **Prisma** - Database ORM
- **PostgreSQL** - Database
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Express Validator** - Input validation

## 📦 Installation

### Prerequisites
- Node.js 18+
- PostgreSQL database
- Git

### Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd final-project-fe-sweetmerry
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   
   # Copy environment file
   cp env.example .env
   
   # Update .env with your database credentials
   # DATABASE_URL="postgresql://username:password@localhost:5432/sweetmerry_db"
   # JWT_SECRET="your-secret-key"
   
   # Setup database
   npx prisma generate
   npx prisma db push
   npm run seed
   
   # Start development server
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   
   # Create environment file
   echo "VITE_API_URL=http://localhost:5000/api" > .env
   
   # Start development server
   npm run dev
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
```env
NODE_ENV=development
PORT=5000
DATABASE_URL="postgresql://username:password@localhost:5432/sweetmerry_db"
JWT_SECRET="your-super-secret-jwt-key"
CORS_ORIGIN="http://localhost:3000"
```

#### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
```

## 📚 API Documentation

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user profile

### Services
- `GET /api/services` - Get all services (with filters)
- `GET /api/services/:id` - Get service by ID
- `POST /api/services` - Create service (admin only)
- `PUT /api/services/:id` - Update service (admin only)
- `DELETE /api/services/:id` - Delete service (admin only)
- `GET /api/services/categories/list` - Get service categories

### Bookings
- `GET /api/bookings` - Get user/admin bookings
- `GET /api/bookings/:id` - Get booking by ID
- `POST /api/bookings` - Create new booking
- `PUT /api/bookings/:id` - Update booking
- `DELETE /api/bookings/:id` - Delete booking (admin only)
- `GET /api/bookings/stats/overview` - Get booking statistics (admin only)

### Users
- `GET /api/users` - Get all users (admin only)
- `GET /api/users/:id` - Get user by ID (admin only)
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user (admin only)
- `GET /api/users/stats/overview` - Get user statistics (admin only)

## 🗄️ Database Schema

### Users
- `id` - Unique identifier
- `email` - Email address (unique)
- `password` - Hashed password
- `name` - Full name
- `role` - User role (USER/ADMIN)
- `phone` - Phone number (optional)
- `address` - Address (optional)
- `createdAt` - Account creation date
- `updatedAt` - Last update date

### Services
- `id` - Unique identifier
- `name` - Service name
- `description` - Service description
- `price` - Service price
- `duration` - Duration in minutes
- `category` - Service category
- `image` - Service image URL (optional)
- `isActive` - Service availability status
- `createdAt` - Service creation date
- `updatedAt` - Last update date

### Bookings
- `id` - Unique identifier
- `userId` - User ID (foreign key)
- `serviceId` - Service ID (foreign key)
- `date` - Booking date
- `time` - Booking time
- `status` - Booking status (PENDING/CONFIRMED/COMPLETED/CANCELLED)
- `notes` - Additional notes (optional)
- `createdAt` - Booking creation date
- `updatedAt` - Last update date

## 🚀 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

### Quick Deployment (Render)

1. **Backend Deployment**
   - Connect GitHub repository to Render
   - Create PostgreSQL database
   - Set environment variables
   - Deploy

2. **Frontend Deployment**
   - Create static site on Render
   - Set build command: `npm install && npm run build`
   - Set publish directory: `dist`
   - Configure environment variables

## 🧪 Testing

### Demo Credentials

#### Admin User
- Email: `admin@sweetmerry.com`
- Password: `admin123`

#### Regular User
- Email: `user@sweetmerry.com`
- Password: `user123`

### Manual Testing

1. **User Registration/Login**
   - Register a new account
   - Login with credentials
   - Verify profile access

2. **Service Booking**
   - Browse available services
   - Select a service
   - Make a booking
   - Verify booking confirmation

3. **Admin Features**
   - Login as admin
   - Access admin dashboard
   - Manage services
   - Manage bookings
   - Manage users

## 📱 Screenshots

### User Interface
- Home page with service showcase
- Service listing with filters
- Booking form with date/time selection
- User dashboard with booking history
- Profile management

### Admin Interface
- Admin dashboard with statistics
- Service management interface
- Booking management with status updates
- User management panel

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Input validation and sanitization
- CORS protection
- Role-based access control
- Protected API endpoints

## 🎨 UI/UX Features

- Responsive design for all devices
- Modern and clean interface
- Loading states and error handling
- Form validation
- Toast notifications
- Intuitive navigation

## 📈 Performance

- Optimized database queries
- Efficient state management
- Lazy loading of components
- Optimized bundle size
- CDN-ready static assets

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
1. Check the [documentation](./docs/)
2. Review the [deployment guide](./DEPLOYMENT.md)
3. Open an issue on GitHub
4. Contact the development team

## 🔄 Changelog

### Version 1.0.0
- Initial release
- Complete booking management system
- User and admin interfaces
- Full API implementation
- Production deployment ready

## 🙏 Acknowledgments

- React team for the amazing framework
- Vite team for the fast build tool
- Tailwind CSS for the utility-first CSS framework
- Prisma team for the excellent ORM
- All contributors and testers

---

**Built with ❤️ by the SweetMerry Team**
