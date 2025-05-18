import express from 'express';
import { register, login, getCurrentUser } from '../controllers/auth.controller.js';
import { verifyToken } from '../middleware/auth.middleware.js';

const router = express.Router();

// Test endpoint to check email domain validation
router.post('/validate-email', (req, res) => {
  const { email, role } = req.body;
  
  // Check if admin email
  if (role === 'admin' && !email.endsWith('@admin.ratemystore.com')) {
    return res.status(400).json({ 
      valid: false,
      message: 'Admin accounts must use @admin.ratemystore.com domain'
    });
  }
  
  // Check if store owner email
  if (role === 'store_owner' && !email.endsWith('@owner.ratemystore.com')) {
    return res.status(400).json({ 
      valid: false,
      message: 'Store owner accounts must use @owner.ratemystore.com domain'
    });
  }
  
  // Valid email domain for the role
  return res.json({ valid: true });
});

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.get('/me', verifyToken, getCurrentUser);

export default router; 