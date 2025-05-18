# RateMyStore

A full-stack web application that allows users to discover, rate, and review stores. Built with React, Node.js, Express, and PostgreSQL.

## Features

### User Management

- Multi-role authentication system (Admin, Store Owner, Regular User)
- JWT-based authentication
- Role-specific email domains (@admin.ratemystore.com, @owner.ratemystore.com)
- Secure password hashing with bcrypt
- User profile management

### Store Management

- Create, read, update, and delete stores
- Store categorization (Restaurant, Cafe, Retail, Electronics, etc.)
- Store details including name, address, description, opening hours
- Image URL support for store photos
- Store approval system managed by administrators

### Rating System

- Users can rate stores from 1-5 stars
- Add comments with ratings
- View average store ratings
- Store owner dashboard to monitor ratings

### Administration

- Admin dashboard with statistics
- User management (create, update, delete users)
- Store management (approve, edit, delete stores)
- Role-based access control

## Technology Stack

### Frontend

- React.js
- React Router for navigation
- Context API for state management
- Axios for API communication
- Bootstrap for styling
- React Icons

### Backend

- Node.js
- Express.js
- PostgreSQL database
- JWT for authentication
- Bcrypt for password hashing
- CORS enabled

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

### Installation

1. Clone the repository
   \`\`\`bash
   git clone [repository-url]
   cd RateMyStore
   \`\`\`

2. Install Server Dependencies
   \`\`\`bash
   cd server
   npm install
   \`\`\`

3. Configure Environment Variables
   Create a .env file in the server directory with the following:
   \`\`\`
   PORT=5000
   NODE_ENV=development
   DB_USERNAME=postgres
   DB_PASSWORD=your_password
   DB_DATABASE=ratemystore
   DB_HOST=localhost
   DB_PORT=5432
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRES_IN=1d
   \`\`\`

4. Install Client Dependencies
   \`\`\`bash
   cd ../client
   npm install
   \`\`\`

5. Start the Application
   Server:
   \`\`\`bash
   cd server
   npm start
   \`\`\`

Client:
\`\`\`bash
cd client
npm start
\`\`\`

The application will be available at http://localhost:3000

## Default User Accounts

### Admin

- Email: admin@admin.ratemystore.com
- Password: admin123

### Store Owner

- Email: owner@owner.ratemystore.com
- Password: owner123

### Regular User

- Email: user@example.com
- Password: user123

## Project Structure

### Client

\`\`\`
client/
├── public/
├── src/
│ ├── components/ # Reusable React components
│ ├── context/ # React Context providers
│ ├── layouts/ # Page layouts
│ ├── pages/ # Route components
│ ├── styles/ # CSS stylesheets
│ ├── utils/ # Utility functions
│ ├── App.js # Root component
│ └── index.js # Entry point
\`\`\`

### Server

\`\`\`
server/
├── src/
│ ├── config/ # Database and app configuration
│ ├── controllers/ # Route controllers
│ ├── middleware/ # Express middleware
│ ├── models/ # Database models
│ ├── routes/ # API routes
│ └── index.js # Entry point
\`\`\`

## API Endpoints

### Authentication

- POST /api/auth/register - Register new user
- POST /api/auth/login - User login
- GET /api/auth/me - Get current user

### Users

- GET /api/users - Get all users (admin only)
- POST /api/users - Create new user (admin only)
- PUT /api/users/:id - Update user
- DELETE /api/users/:id - Delete user (admin only)

### Stores

- GET /api/stores - Get all stores
- POST /api/stores - Create new store (store owner only)
- GET /api/stores/:id - Get store details
- PUT /api/stores/:id - Update store (admin/owner only)
- DELETE /api/stores/:id - Delete store (admin only)

### Ratings

- GET /api/ratings - Get all ratings
- POST /api/ratings - Create new rating
- PUT /api/ratings/:id - Update rating
- DELETE /api/ratings/:id - Delete rating

## Database Schema

### Users Table

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(100) UNIQUE NOT NULL,
    username VARCHAR(50) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin', 'store_owner')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Stores Table

```sql
CREATE TABLE stores (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    address TEXT NOT NULL,
    description TEXT,
    owner_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    average_rating NUMERIC(3,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Ratings Table

```sql
CREATE TABLE ratings (
    id SERIAL PRIMARY KEY,
    store_id INTEGER REFERENCES stores(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(store_id, user_id)
);
```

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control
- Input validation and sanitization
- Protected API endpoints
- CORS configuration
