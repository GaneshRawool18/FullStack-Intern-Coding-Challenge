import express from 'express';
import { verifyToken } from '../middleware/auth.middleware.js';
import db from '../config/db.js';
import bcrypt from 'bcryptjs';

const router = express.Router();

// Store Owner Dashboard: Get ratings for their store
router.get('/store/ratings', verifyToken, async (req, res) => {
  try {
    // Get the store owned by the logged-in user
    const storeResult = await query(
      'SELECT id FROM stores WHERE owner_id = $1 LIMIT 1',
      [req.user.id]
    );
    if (storeResult.rows.length === 0) {
      return res.json({ averageRating: 0, totalRatings: 0, ratings: [] });
    }
    const storeId = storeResult.rows[0].id;

    // Get all ratings for this store
    const ratingsResult = await query(
      `SELECT r.id, r.rating, r.comment, r.created_at, u.name AS username
       FROM ratings r
       JOIN users u ON r.user_id = u.id
       WHERE r.store_id = $1
       ORDER BY r.created_at DESC`,
      [storeId]
    );

    // Calculate average
    const ratings = ratingsResult.rows;
    const totalRatings = ratings.length;
    const averageRating = totalRatings
      ? (ratings.reduce((sum, r) => sum + r.rating, 0) / totalRatings).toFixed(1)
      : 0;

    res.json({
      averageRating: Number(averageRating),
      totalRatings,
      ratings
    });
  } catch (error) {
    console.error('Error fetching store ratings:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;