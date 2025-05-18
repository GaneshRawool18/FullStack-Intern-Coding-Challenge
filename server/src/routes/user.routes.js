import express from 'express';
import { verifyToken, isAdmin } from '../middleware/auth.middleware.js';
import { query } from '../config/db.js';

const router = express.Router();

// All routes require authentication
router.use(verifyToken);

// Admin stats endpoint
router.get('/admin/stats', isAdmin, async (req, res) => {
  try {
    // Get total users count
    const usersResult = await query('SELECT COUNT(*) FROM users');
    
    // Get total stores count
    const storesResult = await query('SELECT COUNT(*) FROM stores');
    
    // Get total ratings count
    const ratingsResult = await query('SELECT COUNT(*) FROM ratings');
    
    // Send statistics
    res.json({
      totalUsers: parseInt(usersResult.rows[0].count),
      totalStores: parseInt(storesResult.rows[0].count),
      totalRatings: parseInt(ratingsResult.rows[0].count)
    });
  } catch (err) {
    console.error('Error fetching admin stats:', err);
    res.status(500).json({ message: 'Error fetching admin statistics' });
  }
});

// Admin-only routes
router.get('/', isAdmin, async (req, res) => {
  try {
    // Support filtering by role for store owner selection
    let queryStr = 'SELECT id, username, email, role FROM users';
    let params = [];
    
    // Filter by role if specified
    if (req.query.role) {
      queryStr += ' WHERE role = $1';
      params.push(req.query.role);
    }
    
    const result = await query(queryStr, params);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ message: 'Error fetching users' });
  }
});

router.get('/:id', isAdmin, async (req, res) => {
  try {
    const result = await query(
      'SELECT id, username, email, role FROM users WHERE id = $1',
      [req.params.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching user:', err);
    res.status(500).json({ message: 'Error fetching user' });
  }
});

// Create user (admin only)
router.post('/', isAdmin, async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    
    // Validate email domain based on role
    let isValidEmail = true;
    let errorMessage = '';
    
    if (role === 'admin' && !email.endsWith('@admin.ratemystore.com')) {
      isValidEmail = false;
      errorMessage = 'Admin accounts must use @admin.ratemystore.com domain';
    }
    
    if (role === 'store_owner' && !email.endsWith('@owner.ratemystore.com')) {
      isValidEmail = false;
      errorMessage = 'Store owner accounts must use @owner.ratemystore.com domain';
    }
    
    if (!isValidEmail) {
      return res.status(400).json({ message: errorMessage });
    }
    
    // Check if email already exists
    const existingUser = await query('SELECT id FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: 'Email already in use' });
    }
    
    // Hash password
    const bcrypt = await import('bcryptjs');
    const hashedPassword = await bcrypt.default.hash(password, 10);
    
    // Create user
    const result = await query(
      `INSERT INTO users (username, email, password, role) 
       VALUES ($1, $2, $3, $4) 
       RETURNING id, username, email, role`,
      [username, email, hashedPassword, role]
    );
    
    res.status(201).json({
      message: 'User created successfully',
      user: result.rows[0]
    });
  } catch (err) {
    console.error('Error creating user:', err);
    res.status(500).json({ message: 'Error creating user' });
  }
});

// Password change route
router.put('/:id/password', async (req, res) => {
  // Only allow users to change their own password or admins to change any password
  if (req.user.id !== parseInt(req.params.id) && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Not authorized to update this user\'s password' });
  }
  
  try {
    const { currentPassword, newPassword } = req.body;
    
    // Get user's current password
    const userResult = await query(
      'SELECT password FROM users WHERE id = $1',
      [req.params.id]
    );
    
    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Verify current password
    const bcrypt = await import('bcryptjs');
    const passwordMatch = await bcrypt.default.compare(currentPassword, userResult.rows[0].password);
    
    if (!passwordMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }
    
    // Hash new password
    const hashedPassword = await bcrypt.default.hash(newPassword, 10);
    
    // Update password
    await query(
      'UPDATE users SET password = $1 WHERE id = $2',
      [hashedPassword, req.params.id]
    );
    
    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error('Error changing password:', err);
    res.status(500).json({ message: 'Error changing password' });
  }
});

router.delete('/:id', isAdmin, async (req, res) => {
  try {
    const result = await query(
      'DELETE FROM users WHERE id = $1 RETURNING id',
      [req.params.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error('Error deleting user:', err);
    res.status(500).json({ message: 'Error deleting user' });
  }
});

// Update user role (admin only)
router.put('/:id/role', isAdmin, async (req, res) => {
  try {
    const { role } = req.body;
    
    if (!['user', 'store_owner', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }
    
    const result = await query(
      'UPDATE users SET role = $1 WHERE id = $2 RETURNING id, username, email, role',
      [role, req.params.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({
      message: 'User role updated successfully',
      user: result.rows[0]
    });
  } catch (err) {
    console.error('Error updating user role:', err);
    res.status(500).json({ message: 'Error updating user role' });
  }
});

// Mixed access routes (admin or self)
router.put('/:id', async (req, res) => {
  // Only allow users to update their own profile or admins to update any profile
  if (req.user.id !== parseInt(req.params.id) && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Not authorized to update this user' });
  }
  
  try {
    const { username, email } = req.body;
    
    const result = await query(
      'UPDATE users SET username = $1, email = $2 WHERE id = $3 RETURNING id, username, email, role',
      [username, email, req.params.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({
      message: 'User updated successfully',
      user: result.rows[0]
    });
  } catch (err) {
    console.error('Error updating user:', err);
    res.status(500).json({ message: 'Error updating user' });
  }
});

// User dashboard stats
router.get('/stats/dashboard', async (req, res) => {
  // Implementation of getting user stats
});

export default router; 