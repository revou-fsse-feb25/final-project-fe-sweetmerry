# SweetMerry API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Endpoints

### Authentication

#### POST /auth/register
Register a new user.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "081234567890",
  "address": "Jl. Example No. 123"
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "user_id",
    "email": "john@example.com",
    "name": "John Doe",
    "role": "USER",
    "phone": "081234567890",
    "address": "Jl. Example No. 123",
    "createdAt": "2024-01-01T00:00:00.000Z"
  },
  "token": "jwt_token_here"
}
```

#### POST /auth/login
Login user.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "user": {
    "id": "user_id",
    "email": "john@example.com",
    "name": "John Doe",
    "role": "USER",
    "phone": "081234567890",
    "address": "Jl. Example No. 123",
    "createdAt": "2024-01-01T00:00:00.000Z"
  },
  "token": "jwt_token_here"
}
```

#### GET /auth/me
Get current user profile (requires authentication).

**Response:**
```json
{
  "user": {
    "id": "user_id",
    "email": "john@example.com",
    "name": "John Doe",
    "role": "USER",
    "phone": "081234567890",
    "address": "Jl. Example No. 123"
  }
}
```

### Services

#### GET /services
Get all services (public).

**Query Parameters:**
- `category` (optional): Filter by category
- `search` (optional): Search in name and description
- `minPrice` (optional): Minimum price filter
- `maxPrice` (optional): Maximum price filter

**Response:**
```json
{
  "services": [
    {
      "id": "service_id",
      "name": "Facial Treatment",
      "description": "Deep cleansing facial treatment",
      "price": 150000,
      "duration": 60,
      "category": "Beauty",
      "image": "https://example.com/image.jpg",
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "total": 1
}
```

#### GET /services/:id
Get service by ID (public).

**Response:**
```json
{
  "service": {
    "id": "service_id",
    "name": "Facial Treatment",
    "description": "Deep cleansing facial treatment",
    "price": 150000,
    "duration": 60,
    "category": "Beauty",
    "image": "https://example.com/image.jpg",
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### POST /services
Create new service (admin only).

**Request Body:**
```json
{
  "name": "New Service",
  "description": "Service description",
  "price": 100000,
  "duration": 45,
  "category": "Beauty",
  "image": "https://example.com/image.jpg"
}
```

#### PUT /services/:id
Update service (admin only).

**Request Body:**
```json
{
  "name": "Updated Service",
  "price": 120000,
  "isActive": false
}
```

#### DELETE /services/:id
Delete service (admin only).

#### GET /services/categories/list
Get all service categories (public).

**Response:**
```json
{
  "categories": ["Beauty", "Wellness", "Hair"]
}
```

### Bookings

#### GET /bookings
Get user's bookings (authenticated) or all bookings (admin).

**Query Parameters:**
- `status` (optional): Filter by status (PENDING, CONFIRMED, CANCELLED, COMPLETED)
- `date` (optional): Filter by date (ISO format)
- `serviceId` (optional): Filter by service ID

**Response:**
```json
{
  "bookings": [
    {
      "id": "booking_id",
      "date": "2024-01-15T00:00:00.000Z",
      "time": "10:00",
      "status": "CONFIRMED",
      "notes": "Special instructions",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "user": {
        "id": "user_id",
        "name": "John Doe",
        "email": "john@example.com",
        "phone": "081234567890"
      },
      "service": {
        "id": "service_id",
        "name": "Facial Treatment",
        "price": 150000,
        "duration": 60,
        "category": "Beauty"
      }
    }
  ],
  "total": 1
}
```

#### GET /bookings/:id
Get booking by ID (authenticated).

**Response:**
```json
{
  "booking": {
    "id": "booking_id",
    "date": "2024-01-15T00:00:00.000Z",
    "time": "10:00",
    "status": "CONFIRMED",
    "notes": "Special instructions",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "user": {
      "id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "081234567890"
    },
    "service": {
      "id": "service_id",
      "name": "Facial Treatment",
      "price": 150000,
      "duration": 60,
      "category": "Beauty",
      "description": "Deep cleansing facial treatment"
    }
  }
}
```

#### POST /bookings
Create new booking (authenticated).

**Request Body:**
```json
{
  "serviceId": "service_id",
  "date": "2024-01-15",
  "time": "10:00",
  "notes": "Special instructions"
}
```

#### PUT /bookings/:id
Update booking (authenticated).

**Request Body:**
```json
{
  "status": "CONFIRMED",
  "date": "2024-01-16",
  "time": "11:00",
  "notes": "Updated notes"
}
```

#### DELETE /bookings/:id
Delete booking (admin only).

#### GET /bookings/stats/overview
Get booking statistics (admin only).

**Response:**
```json
{
  "total": 100,
  "pending": 10,
  "confirmed": 20,
  "completed": 60,
  "cancelled": 10,
  "today": 5
}
```

### Users (Admin Only)

#### GET /users
Get all users (admin only).

**Query Parameters:**
- `role` (optional): Filter by role (USER, ADMIN)
- `search` (optional): Search in name and email

**Response:**
```json
{
  "users": [
    {
      "id": "user_id",
      "email": "john@example.com",
      "name": "John Doe",
      "role": "USER",
      "phone": "081234567890",
      "address": "Jl. Example No. 123",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "_count": {
        "bookings": 5
      }
    }
  ],
  "total": 1
}
```

#### GET /users/:id
Get user by ID (admin only).

#### PUT /users/:id
Update user (admin only).

**Request Body:**
```json
{
  "name": "Updated Name",
  "role": "ADMIN",
  "phone": "081234567891"
}
```

#### DELETE /users/:id
Delete user (admin only).

#### GET /users/stats/overview
Get user statistics (admin only).

**Response:**
```json
{
  "total": 50,
  "admins": 2,
  "regular": 48,
  "newThisMonth": 10,
  "topUsers": [
    {
      "id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "_count": {
        "bookings": 15
      }
    }
  ]
}
```

## Error Responses

### 400 Bad Request
```json
{
  "error": "Validation error",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

### 401 Unauthorized
```json
{
  "error": "Access token required"
}
```

### 403 Forbidden
```json
{
  "error": "Admin access required"
}
```

### 404 Not Found
```json
{
  "error": "Service not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Something went wrong!",
  "message": "Internal server error"
}
```

## Status Codes

- `PENDING`: Booking is waiting for confirmation
- `CONFIRMED`: Booking has been confirmed
- `COMPLETED`: Service has been completed
- `CANCELLED`: Booking has been cancelled

## User Roles

- `USER`: Regular user who can book services
- `ADMIN`: Administrator who can manage all data

## Demo Credentials

### Admin User
- Email: admin@sweetmerry.com
- Password: admin123

### Regular User
- Email: user@sweetmerry.com
- Password: user123
