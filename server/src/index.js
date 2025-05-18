import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import { query } from './config/db.js';
import setupDatabase from './config/setupDb.js';

// Import routes
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import storeRoutes from './routes/store.routes.js';
import ratingRoutes from './routes/rating.routes.js';

// Load environment variables (should be called before using any env vars)
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const ALTERNATIVE_PORTS = [5001, 5002, 5003, 5004, 5005];

// CORS configuration - Allow requests from any origin in development
app.use(cors({
  origin: '*',  // Allow all origins
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'HEAD'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// JSON body parser
app.use(express.json());

// Request logger middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Test database connection on startup
app.get('/test-db', async (req, res) => {
  try {
    const result = await query('SELECT NOW()');
    res.json({ 
      message: 'Database connection successful!',
      timestamp: result.rows[0].now 
    });
  } catch (err) {
    res.status(500).json({ 
      error: 'Database connection failed',
      message: err.message 
    });
  }
});

// Pre-flight CORS check for complex requests
app.options('*', cors());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin/users', userRoutes); // Admin user management API
app.use('/api/stores', storeRoutes);
app.use('/api/admin/stores', storeRoutes); // Admin store management API
app.use('/api/ratings', ratingRoutes);
app.use('/api/admin/dashboard', (req, res) => {
  // Mock data for admin dashboard
  res.json({
    totalUsers: 15,
    totalStores: 8,
    totalRatings: 42,
    usersByRole: {
      admin: 2,
      store_owner: 5,
      user: 8
    },
    recentUsers: [
      { id: 1, username: "john_doe", email: "john@example.com", role: "user" },
      { id: 2, username: "store_owner1", email: "owner1@owner.ratemystore.com", role: "store_owner" },
      { id: 3, username: "alice_smith", email: "alice@example.com", role: "user" }
    ],
    recentStores: [
      { id: 1, name: "Tech Haven", address: "123 Main St", averageRating: 4.5 },
      { id: 2, name: "Fashion Outlet", address: "456 Market St", averageRating: 4.0 }
    ],
    topRatedStores: [
      { id: 3, name: "Gourmet Deli", address: "789 Food Ave", averageRating: 4.8 },
      { id: 4, name: "Book World", address: "101 Library Lane", averageRating: 4.7 }
    ]
  });
});

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'RateMyStore API is running!',
    endpoints: {
      auth: '/api/auth',
      users: '/api/users',
      stores: '/api/stores',
      ratings: '/api/ratings',
      admin: {
        stats: '/api/admin/stats',
        users: '/api/admin/users',
        stores: '/api/admin/stores'
      }
    },
    defaultAccounts: {
      admin: {
        email: 'admin@admin.ratemystore.com',
        password: 'admin123'
      },
      storeOwner: {
        email: 'owner@owner.ratemystore.com',
        password: 'owner123'
      },
      user: {
        email: 'user@example.com',
        password: 'user123'
      }
    }
  });
});

// Function to try starting the server on different ports
function startServerOnPort(port, alternativePorts = []) {
  const server = app.listen(port)
    .on('listening', () => {
      const actualPort = server.address().port;
      console.log(`Server is running on port ${actualPort}`);
      console.log(`API documentation available at http://localhost:${actualPort}`);
      console.log('Default accounts:');
      console.log('- Admin: admin@admin.ratemystore.com (password: admin123)');
      console.log('- Store Owner: owner@owner.ratemystore.com (password: owner123)');
      console.log('- User: user@example.com (password: user123)');
    })
    .on('error', (err) => {
      if (err.code === 'EADDRINUSE' && alternativePorts.length > 0) {
        console.log(`Port ${port} is already in use, trying alternative port ${alternativePorts[0]}`);
        // Try the next port
        startServerOnPort(alternativePorts[0], alternativePorts.slice(1));
      } else {
        console.error('Failed to start server:', err);
        process.exit(1);
      }
    });
}

// Initialize database and start server
async function startServer() {
  try {
    // Set up database tables
    console.log('Setting up database...');
    await setupDatabase();
    
    // Start server with port fallback
    startServerOnPort(PORT, ALTERNATIVE_PORTS);
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

// Start everything
startServer(); 