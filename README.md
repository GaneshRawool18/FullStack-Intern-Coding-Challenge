# RateMyStore - Store Rating Platform

A full-stack web application that allows users to rate and review stores, with dashboards for users, store owners, and administrators.

## Features

- **Authentication & Authorization**
  - JWT-based authentication
  - Role-based access control (Admin, Normal User, Store Owner)
  - Secure password validation

- **User Management**
  - User registration and login
  - Profile management
  - Role-based dashboards

- **Store Management**
  - Browse stores with search and filter capabilities
  - Rate stores and provide feedback
  - Store owner dashboard to view ratings
  - Admin dashboard to manage stores and users

## Technology Stack

### Backend
- **Framework**: Express.js
- **Database**: PostgreSQL with Sequelize ORM
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Express Validator

### Frontend
- **Framework**: React.js
- **Routing**: React Router
- **Forms**: React Hook Form with Yup validation
- **UI Components**: Custom components with CSS styling
- **State Management**: Context API

## Project Structure

```
project-root/
├── client/                 # Frontend React application
│   ├── public/             # Public assets
│   └── src/                # React source code
│       ├── assets/         # Static assets
│       ├── components/     # Reusable UI components
│       ├── context/        # React Context providers
│       ├── hooks/          # Custom React hooks
│       ├── pages/          # Page components
│       ├── services/       # API service layer
│       └── utils/          # Utility functions
│
└── server/                 # Backend Express application
    ├── src/                # Server source code
    │   ├── config/         # Configuration files
    │   ├── controllers/    # Route controllers
    │   ├── middleware/     # Express middleware
    │   ├── models/         # Sequelize models
    │   ├── routes/         # API routes
    │   └── utils/          # Utility functions
    └── .env                # Environment variables
```

## Database Schema

### Users
- id (PK)
- name
- email
- password (hashed)
- address
- role (enum: 'admin', 'user', 'store_owner')
- createdAt
- updatedAt

### Stores
- id (PK)
- name
- address
- description
- ownerId (FK -> Users)
- averageRating
- totalRatings
- createdAt
- updatedAt

### Ratings
- id (PK)
- userId (FK -> Users)
- storeId (FK -> Stores)
- rating (1-5)
- comment
- createdAt
- updatedAt

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Users
- `GET /api/users` - Get all users (admin only)
- `GET /api/users/:id` - Get user by ID (admin only)
- `POST /api/users` - Create new user (admin only)
- `PUT /api/users/:id` - Update user (admin or self)
- `DELETE /api/users/:id` - Delete user (admin only)
- `GET /api/users/stats/dashboard` - Get user dashboard stats

### Stores
- `GET /api/stores` - Get all stores
- `GET /api/stores/:id` - Get store by ID
- `POST /api/stores` - Create new store (admin only)
- `PUT /api/stores/:id` - Update store (admin or store owner)
- `DELETE /api/stores/:id` - Delete store (admin only)
- `GET /api/stores/admin/stats` - Get store stats for admin

### Ratings
- `GET /api/ratings/store/:storeId` - Get all ratings for a store
- `GET /api/ratings/user` - Get all ratings by current user
- `POST /api/ratings/store/:storeId` - Create or update rating
- `DELETE /api/ratings/:id` - Delete rating

## Setup Instructions

### Prerequisites
- Node.js and npm
- PostgreSQL database

### Installation

1. Clone the repository
   ```
   git clone https://github.com/yourusername/ratemystore.git
   cd ratemystore
   ```

2. Install backend dependencies
   ```
   cd server
   npm install
   ```

3. Install frontend dependencies
   ```
   cd ../client
   npm install
   ```

4. Configure environment variables
   - Create `.env` file in the server directory based on `sample.env`

5. Initialize the database
   - Create PostgreSQL database named 'ratemystore'
   - Database will be initialized when server starts

### Running the Application

1. Start the backend server
   ```
   cd server
   npm run dev
   ```

2. Start the frontend application
   ```
   cd client
   npm start
   ```

3. Access the application at `http://localhost:3000`

## License

This project is licensed under the MIT License. 