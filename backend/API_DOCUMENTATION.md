# SweetMerry API Documentation

## Base URL
- Development: `http://localhost:5000/api`
- Production: `https://sweetmerry-backend.onrender.com/api`

## Authentication

All endpoints except `/auth/register` and `/auth/login` require authentication via JWT token.

### Headers
```
Authorization: Bearer <your_jwt_token>
Content-Type: application/json
```

## Endpoints

### Authentication

#### Register User
- **POST** `/auth/register`
- **Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "password123",
    "name": "John Doe",
    "phone": "+1234567890",
    "address": "123 Main St"
  }
  ```
- **Response:**
  ```json
  {
    "message": "User created successfully",
    "token": "jwt_token",
    "user": {
      "id": "user_id",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "USER",
      "phone": "+1234567890",
      "address": "123 Main St"
    }
  }
  ```

#### Login User
- **POST** `/auth/login`
- **Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **Response:**
  ```json
  {
    "message": "Login successful",
    "token": "jwt_token",
    "user": {
      "id": "user_id",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "USER",
      "phone": "+1234567890",
      "address": "123 Main St"
    }
  }
  ```

#### Get Current User Profile
- **GET** `/auth/me`
- **Headers:** `Authorization: Bearer <token>`
- **Response:**
  ```json
  {
    "id": "user_id",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "USER",
    "phone": "+1234567890",
    "address": "123 Main St",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
  ```

### Services

#### Get All Services
- **GET** `/services`
- **Query Parameters:**
  - `category` (optional): Filter by category
  - `search` (optional): Search by name or description
  - `active` (optional): Filter by active status (true/false)
- **Response:**
  ```json
  [
    {
      "id": "service_id",
      "name": "Haircut & Styling",
      "description": "Professional haircut and styling service",
      "price": 35.00,
      "duration": 60,
      "category": "Hair",
      "image": "/images/haircut.jpg",
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
  ```

#### Get Service by ID
- **GET** `/services/:id`
- **Response:**
  ```json
  {
    "id": "service_id",
    "name": "Haircut & Styling",
    "description": "Professional haircut and styling service",
    "price": 35.00,
    "duration": 60,
    "category": "Hair",
    "image": "/images/haircut.jpg",
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
  ```

#### Create Service (Admin Only)
- **POST** `/services`
- **Headers:** `Authorization: Bearer <admin_token>`
- **Body:**
  ```json
  {
    "name": "New Service",
    "description": "Service description",
    "price": 50.00,
    "duration": 60,
    "category": "Category",
    "image": "/images/service.jpg"
  }
  ```

#### Update Service (Admin Only)
- **PUT** `/services/:id`
- **Headers:** `Authorization: Bearer <admin_token>`
- **Body:** (Partial updates allowed)
  ```json
  {
    "name": "Updated Service Name",
    "price": 55.00,
    "isActive": false
  }
  ```

#### Delete Service (Admin Only)
- **DELETE** `/services/:id`
- **Headers:** `Authorization: Bearer <admin_token>`

#### Get Service Categories
- **GET** `/services/categories/list`
- **Response:**
  ```json
  ["Hair", "Nails", "Skin Care", "Massage", "Hair Removal"]
  ```

### Bookings

#### Get All Bookings
- **GET** `/bookings`
- **Headers:** `Authorization: Bearer <token>`
- **Query Parameters:**
  - `status` (optional): Filter by status (PENDING/CONFIRMED/COMPLETED/CANCELLED)
  - `page` (optional): Page number (default: 1)
  - `limit` (optional): Items per page (default: 10)
- **Response:**
  ```json
  {
    "bookings": [
      {
        "id": "booking_id",
        "userId": "user_id",
        "serviceId": "service_id",
        "date": "2024-01-01T00:00:00.000Z",
        "time": "10:00",
        "status": "PENDING",
        "notes": "Special requests",
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z",
        "user": {
          "id": "user_id",
          "name": "John Doe",
          "email": "user@example.com"
        },
        "service": {
          "id": "service_id",
          "name": "Haircut & Styling",
          "price": 35.00,
          "duration": 60
        }
      }
    ],
    "total": 100,
    "page": 1,
    "totalPages": 10
  }
  ```

#### Get Booking by ID
- **GET** `/bookings/:id`
- **Headers:** `Authorization: Bearer <token>`
- **Response:**
  ```json
  {
    "id": "booking_id",
    "userId": "user_id",
    "serviceId": "service_id",
    "date": "2024-01-01T00:00:00.000Z",
    "time": "10:00",
    "status": "PENDING",
    "notes": "Special requests",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "user": {
      "id": "user_id",
      "name": "John Doe",
      "email": "user@example.com",
      "phone": "+1234567890"
    },
    "service": {
      "id": "service_id",
      "name": "Haircut & Styling",
      "price": 35.00,
      "duration": 60,
      "description": "Professional haircut and styling service"
    }
  }
  ```

#### Create Booking
- **POST** `/bookings`
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
  ```json
  {
    "serviceId": "service_id",
    "date": "2024-01-01",
    "time": "10:00",
    "notes": "Special requests"
  }
  ```

#### Update Booking
- **PUT** `/bookings/:id`
- **Headers:** `Authorization: Bearer <token>`
- **Body:** (Partial updates allowed)
  ```json
  {
    "status": "CONFIRMED",
    "notes": "Updated notes"
  }
  ```

#### Delete Booking (Admin Only)
- **DELETE** `/bookings/:id`
- **Headers:** `Authorization: Bearer <admin_token>`

#### Get Booking Statistics (Admin Only)
- **GET** `/bookings/stats/overview`
- **Headers:** `Authorization: Bearer <admin_token>`
- **Response:**
  ```json
  {
    "total": 100,
    "pending": 25,
    "confirmed": 50,
    "completed": 20,
    "cancelled": 5
  }
  ```

### Users (Admin Only)

#### Get All Users
- **GET** `/users`
- **Headers:** `Authorization: Bearer <admin_token>`
- **Query Parameters:**
  - `page` (optional): Page number (default: 1)
  - `limit` (optional): Items per page (default: 10)
  - `search` (optional): Search by name or email
- **Response:**
  ```json
  {
    "users": [
      {
        "id": "user_id",
        "email": "user@example.com",
        "name": "John Doe",
        "role": "USER",
        "phone": "+1234567890",
        "address": "123 Main St",
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "total": 100,
    "page": 1,
    "totalPages": 10
  }
  ```

#### Get User by ID
- **GET** `/users/:id`
- **Headers:** `Authorization: Bearer <admin_token>`
- **Response:**
  ```json
  {
    "id": "user_id",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "USER",
    "phone": "+1234567890",
    "address": "123 Main St",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "bookings": [
      {
        "id": "booking_id",
        "serviceId": "service_id",
        "date": "2024-01-01T00:00:00.000Z",
        "time": "10:00",
        "status": "PENDING",
        "service": {
          "name": "Haircut & Styling",
          "price": 35.00
        }
      }
    ]
  }
  ```

#### Update User
- **PUT** `/users/:id`
- **Headers:** `Authorization: Bearer <token>` (users can update their own profile, admins can update any)
- **Body:** (Partial updates allowed)
  ```json
  {
    "name": "Updated Name",
    "phone": "+0987654321",
    "address": "456 New St"
  }
  ```

#### Delete User (Admin Only)
- **DELETE** `/users/:id`
- **Headers:** `Authorization: Bearer <admin_token>`

#### Get User Statistics (Admin Only)
- **GET** `/users/stats/overview`
- **Headers:** `Authorization: Bearer <admin_token>`
- **Response:**
  ```json
  {
    "total": 100,
    "admins": 5,
    "regular": 95,
    "active": 80
  }
  ```

## Error Responses

### 400 Bad Request
```json
{
  "message": "Validation error",
  "errors": [
    {
      "msg": "Invalid email",
      "param": "email",
      "location": "body"
    }
  ]
}
```

### 401 Unauthorized
```json
{
  "message": "Access token required"
}
```

### 403 Forbidden
```json
{
  "message": "Admin access required"
}
```

### 404 Not Found
```json
{
  "message": "Service not found"
}
```

### 500 Internal Server Error
```json
{
  "message": "Internal server error"
}
```

## Demo Credentials

### Admin User
- Email: `admin@sweetmerry.com`
- Password: `admin123`

### Regular User
- Email: `user@sweetmerry.com`
- Password: `user123`

## Rate Limiting

The API implements rate limiting to prevent abuse:
- 100 requests per 15 minutes per IP address
- 1000 requests per day per IP address

## CORS

The API supports CORS for the following origins:
- Development: `http://localhost:3000`
- Production: `https://sweetmerry-frontend.onrender.com`

## Health Check

- **GET** `/api/health`
- **Response:**
  ```json
  {
    "status": "OK",
    "message": "SweetMerry Backend is running"
  }
