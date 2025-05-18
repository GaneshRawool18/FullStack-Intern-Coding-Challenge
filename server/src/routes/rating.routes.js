import express from 'express';
import { verifyToken } from '../middleware/auth.middleware.js';
import db from '../config/db.js';

const router = express.Router();

// Submit or update a rating
router.post('/store/:storeId', verifyToken, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const { storeId } = req.params;
    const userId = req.user.id;

    // Validate rating
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    // Check if user has already rated this store
    const existingRating = await db.query(
      'SELECT id FROM ratings WHERE user_id = $1 AND store_id = $2',
      [userId, storeId]
    );

    let result;
    if (existingRating.rows.length > 0) {
      // Update existing rating
      result = await db.query(
        `UPDATE ratings 
         SET rating = $1, comment = $2, updated_at = NOW()
         WHERE user_id = $3 AND store_id = $4
         RETURNING *`,
        [rating, comment, userId, storeId]
      );
    } else {
      // Create new rating
      result = await db.query(
        `INSERT INTO ratings (rating, comment, user_id, store_id)
         VALUES ($1, $2, $3, $4)
         RETURNING *`,
        [rating, comment, userId, storeId]
      );
    }

    res.json({
      rating: result.rows[0],
      message: existingRating.rows.length > 0 ? 'Rating updated' : 'Rating submitted'
    });
  } catch (err) {
    console.error('Error submitting rating:', err);
    res.status(500).json({ message: 'Error submitting rating' });
  }
});

// Get user's rating for a store
router.get('/store/:storeId/user', verifyToken, async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM ratings WHERE user_id = $1 AND store_id = $2',
      [req.user.id, req.params.storeId]
    );
    
    res.json(result.rows[0] || null);
  } catch (err) {
    console.error('Error fetching user rating:', err);
    res.status(500).json({ message: 'Error fetching rating' });
  }
});

// Delete a rating
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const result = await db.query(
      'DELETE FROM ratings WHERE id = $1 AND user_id = $2 RETURNING id',
      [req.params.id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Rating not found or unauthorized' });
    }

    res.json({ message: 'Rating deleted successfully' });
  } catch (err) {
    console.error('Error deleting rating:', err);
    res.status(500).json({ message: 'Error deleting rating' });
  }
});

export default router;