import jwt from 'jsonwebtoken';
import { query } from '../config/db.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Fallback JWT secret if environment variable is not set
const JWT_SECRET = process.env.JWT_SECRET || 'ratemystore-secret-key-2024';

// Verify JWT token middleware
export const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Get user from database
    const result = await query(
      'SELECT id, email, role FROM users WHERE id = $1',
      [decoded.id]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = result.rows[0];
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' });
    }
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// Check if user is admin
export const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Requires admin role' });
  }
  next();
};

// Check if user is store owner
export const isStoreOwner = (req, res, next) => {
  if (req.user.role !== 'store_owner' && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Requires store owner role' });
  }
  next();
};

// Check if user is admin or store owner
export const isAdminOrStoreOwner = (req, res, next) => {
  if (req.user.role === 'admin' || req.user.role === 'store_owner') {
    return next();
  }
  return res.status(403).json({ message: 'Requires admin or store owner role' });
};

// Check if user is the owner of specific store
export const isStoreOwnerOfStore = async (req, res, next) => {
  try {
    const storeId = parseInt(req.params.id);
    
    if (!storeId) {
      return res.status(400).json({ message: 'Store ID is required' });
    }
    
    // Admin can access any store
    if (req.user.role === 'admin') {
      return next();
    }
    
    // Check if user is the owner of the store
    const result = await query(
      'SELECT * FROM stores WHERE id = $1',
      [storeId]
    );
    
    const store = result.rows[0];
    
    if (!store) {
      return res.status(404).json({ message: 'Store not found' });
    }
    
    if (store.owner_id !== req.user.id) {
      return res.status(403).json({ message: 'You are not authorized to access this store' });
    }
    
    next();
  } catch (err) {
    console.error('Store owner check error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
}; 