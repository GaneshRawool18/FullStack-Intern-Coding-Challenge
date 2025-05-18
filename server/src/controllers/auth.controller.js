import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from '../config/db.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Fallback JWT secret if environment variable is not set
const JWT_SECRET = process.env.JWT_SECRET || 'ratemystore-secret-key-2024';

// Email domain validation for different roles
const validateEmailDomain = (email, role) => {
  // Default role is 'user' for any email domain
  if (!role || role === 'user') {
    return { valid: true, role: 'user' };
  }

  // For admin role, email must be from admin.ratemystore.com domain
  if (role === 'admin') {
    if (email.endsWith('@admin.ratemystore.com')) {
      return { valid: true, role: 'admin' };
    }
    return { valid: false, message: 'Admin accounts must use @admin.ratemystore.com email domain' };
  }

  // For store_owner role, email must be from owner.ratemystore.com domain
  if (role === 'store_owner') {
    if (email.endsWith('@owner.ratemystore.com')) {
      return { valid: true, role: 'store_owner' };
    }
    return { valid: false, message: 'Store owner accounts must use @owner.ratemystore.com email domain' };
  }

  // If role is not recognized
  return { valid: false, message: 'Invalid role specified' };
};

// Automatically assign role based on email domain
const getRoleFromEmail = (email) => {
  if (email.endsWith('@admin.ratemystore.com')) {
    return 'admin';
  }
  if (email.endsWith('@owner.ratemystore.com')) {
    return 'store_owner';
  }
  return 'user';
};

// Register new user
export const register = async (req, res) => {
  try {
    const { username, email, password, role: requestedRole } = req.body;
    
    // Auto-assign role based on email domain or use requested role
    const role = requestedRole || getRoleFromEmail(email);
    
    // Validate email domain for role
    const roleValidation = validateEmailDomain(email, role);
    if (!roleValidation.valid) {
      return res.status(400).json({ message: roleValidation.message });
    }
    
    // Check if user already exists
    const existingUser = await query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );
    
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Create new user
    const result = await query(
      `INSERT INTO users (username, email, password, role) 
       VALUES ($1, $2, $3, $4) 
       RETURNING id, username, email, role`,
      [username, email, hashedPassword, roleValidation.role]
    );
    
    const user = result.rows[0];
    
    // Create token
    const token = jwt.sign(
      { id: user.id },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      },
      token
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ message: 'Error registering user' });
  }
};

// Login user
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user
    const result = await query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    
    const user = result.rows[0];
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Check password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Create token
    const token = jwt.sign(
      { id: user.id },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      },
      token
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Error logging in' });
  }
};

// Get current logged-in user
export const getCurrentUser = async (req, res) => {
  try {
    const result = await query(
      'SELECT id, username, email, role FROM users WHERE id = $1',
      [req.user.id]
    );
    
    const user = result.rows[0];
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({ user });
  } catch (err) {
    console.error('Get current user error:', err);
    res.status(500).json({ message: 'Error fetching user data' });
  }
}; 