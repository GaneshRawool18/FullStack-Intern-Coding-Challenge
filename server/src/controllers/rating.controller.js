const { Rating, Store, User, sequelize } = require('../models');

// Create or update rating
exports.createOrUpdateRating = async (req, res) => {
  try {
    const { storeId } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user.id;
    
    // Check if store exists
    const store = await Store.findByPk(storeId);
    if (!store) {
      return res.status(404).json({ message: 'Store not found' });
    }
    
    // Check if user is trying to rate their own store
    if (store.ownerId === userId) {
      return res.status(403).json({ message: 'Store owners cannot rate their own store' });
    }
    
    // Start transaction
    const transaction = await sequelize.transaction();
    
    try {
      // Check if rating already exists
      const existingRating = await Rating.findOne({
        where: { storeId, userId },
        transaction
      });
      
      let updatedRating;
      
      if (existingRating) {
        // Update existing rating
        const oldRating = existingRating.rating;
        updatedRating = await existingRating.update({
          rating,
          comment
        }, { transaction });
        
        // Update store average rating
        await updateStoreRating(store, oldRating, rating, false, transaction);
      } else {
        // Create new rating
        updatedRating = await Rating.create({
          storeId,
          userId,
          rating,
          comment
        }, { transaction });
        
        // Update store average rating
        await updateStoreRating(store, 0, rating, true, transaction);
      }
      
      // Commit transaction
      await transaction.commit();
      
      res.status(200).json({
        message: existingRating ? 'Rating updated successfully' : 'Rating submitted successfully',
        rating: updatedRating
      });
    } catch (error) {
      // Rollback transaction in case of error
      await transaction.rollback();
      throw error;
    }
  } catch (error) {
    console.error('Create/Update rating error:', error);
    res.status(500).json({ message: 'Error submitting rating' });
  }
};

// Helper function to update store's average rating
async function updateStoreRating(store, oldRating, newRating, isNew, transaction) {
  const currentTotal = store.totalRatings;
  const currentAverage = store.averageRating;
  
  let newTotal, newAverage;
  
  if (isNew) {
    // Adding a new rating
    newTotal = currentTotal + 1;
    newAverage = ((currentAverage * currentTotal) + newRating) / newTotal;
  } else {
    // Updating an existing rating
    newTotal = currentTotal;
    newAverage = ((currentAverage * currentTotal) - oldRating + newRating) / newTotal;
  }
  
  // Update store with new average and total
  await store.update({
    averageRating: newAverage,
    totalRatings: newTotal
  }, { transaction });
}

// Delete rating
exports.deleteRating = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    // Check if rating exists
    const rating = await Rating.findByPk(id);
    if (!rating) {
      return res.status(404).json({ message: 'Rating not found' });
    }
    
    // Check if user is authorized to delete the rating
    if (rating.userId !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this rating' });
    }
    
    // Start transaction
    const transaction = await sequelize.transaction();
    
    try {
      // Get the store for updating average rating
      const store = await Store.findByPk(rating.storeId, { transaction });
      
      if (!store) {
        return res.status(404).json({ message: 'Store not found' });
      }
      
      // Update store average rating
      const currentTotal = store.totalRatings;
      const currentAverage = store.averageRating;
      
      if (currentTotal <= 1) {
        // If this is the only rating, reset to 0
        await store.update({
          averageRating: 0,
          totalRatings: 0
        }, { transaction });
      } else {
        // Recalculate average without this rating
        const newTotal = currentTotal - 1;
        const newAverage = ((currentAverage * currentTotal) - rating.rating) / newTotal;
        
        await store.update({
          averageRating: newAverage,
          totalRatings: newTotal
        }, { transaction });
      }
      
      // Delete the rating
      await rating.destroy({ transaction });
      
      // Commit transaction
      await transaction.commit();
      
      res.status(200).json({ message: 'Rating deleted successfully' });
    } catch (error) {
      // Rollback transaction in case of error
      await transaction.rollback();
      throw error;
    }
  } catch (error) {
    console.error('Delete rating error:', error);
    res.status(500).json({ message: 'Error deleting rating' });
  }
};

// Get all ratings for a store
exports.getStoreRatings = async (req, res) => {
  try {
    const { storeId } = req.params;
    
    // Check if store exists
    const store = await Store.findByPk(storeId);
    if (!store) {
      return res.status(404).json({ message: 'Store not found' });
    }
    
    // Get all ratings for the store
    const ratings = await Rating.findAll({
      where: { storeId },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name']
        }
      ],
      order: [['createdAt', 'DESC']]
    });
    
    res.status(200).json({
      storeId,
      storeName: store.name,
      averageRating: store.averageRating,
      totalRatings: store.totalRatings,
      ratings
    });
  } catch (error) {
    console.error('Get store ratings error:', error);
    res.status(500).json({ message: 'Error getting store ratings' });
  }
};

// Get all ratings by a user
exports.getUserRatings = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get all ratings by the user
    const ratings = await Rating.findAll({
      where: { userId },
      include: [
        {
          model: Store,
          as: 'store'
        }
      ],
      order: [['createdAt', 'DESC']]
    });
    
    res.status(200).json({ ratings });
  } catch (error) {
    console.error('Get user ratings error:', error);
    res.status(500).json({ message: 'Error getting user ratings' });
  }
}; 