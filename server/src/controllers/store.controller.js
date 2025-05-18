const { Store, User, Rating, sequelize } = require('../models');
const { Op } = require('sequelize');

// Get all stores
exports.getAllStores = async (req, res) => {
  try {
    const { search, limit = 10, page = 1, sort = 'createdAt', order = 'DESC' } = req.query;
    const offset = (page - 1) * limit;
    
    const whereClause = {};
    
    // Search filter
    if (search) {
      whereClause[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { address: { [Op.iLike]: `%${search}%` } }
      ];
    }
    
    // Ensure sort field is valid to prevent SQL injection
    const validSortFields = ['name', 'address', 'averageRating', 'totalRatings', 'createdAt'];
    const sortField = validSortFields.includes(sort) ? sort : 'createdAt';
    
    // Ensure order is valid
    const sortOrder = order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
    
    const { count, rows: stores } = await Store.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'owner',
          attributes: ['id', 'name', 'email']
        }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [[sortField, sortOrder]]
    });
    
    // If user is logged in, include their ratings for each store
    let storesWithUserRating = stores;
    
    if (req.user) {
      const ratings = await Rating.findAll({
        where: { userId: req.user.id },
        attributes: ['storeId', 'rating']
      });
      
      const ratingMap = ratings.reduce((map, rating) => {
        map[rating.storeId] = rating.rating;
        return map;
      }, {});
      
      storesWithUserRating = stores.map(store => {
        const plainStore = store.get({ plain: true });
        plainStore.userRating = ratingMap[store.id] || null;
        return plainStore;
      });
    }
    
    res.status(200).json({
      stores: storesWithUserRating,
      totalStores: count,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page)
    });
  } catch (error) {
    console.error('Get all stores error:', error);
    res.status(500).json({ message: 'Error getting stores' });
  }
};

// Get store by ID
exports.getStoreById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const store = await Store.findByPk(id, {
      include: [
        {
          model: User,
          as: 'owner',
          attributes: ['id', 'name', 'email']
        },
        {
          model: Rating,
          as: 'ratings',
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['id', 'name']
            }
          ]
        }
      ]
    });
    
    if (!store) {
      return res.status(404).json({ message: 'Store not found' });
    }
    
    // Check if user has rated this store
    let userRating = null;
    if (req.user) {
      const rating = await Rating.findOne({
        where: {
          storeId: id,
          userId: req.user.id
        }
      });
      
      if (rating) {
        userRating = rating.rating;
      }
    }
    
    const storeData = store.get({ plain: true });
    storeData.userRating = userRating;
    
    res.status(200).json({ store: storeData });
  } catch (error) {
    console.error('Get store by ID error:', error);
    res.status(500).json({ message: 'Error getting store' });
  }
};

// Create new store (admin only)
exports.createStore = async (req, res) => {
  try {
    const { name, address, description, ownerId } = req.body;
    
    // Validate if ownerId is provided and is a store_owner
    if (ownerId) {
      const owner = await User.findByPk(ownerId);
      
      if (!owner) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      if (owner.role !== 'store_owner') {
        // Update user role to store_owner
        await owner.update({ role: 'store_owner' });
      }
      
      // Check if user already has a store
      const existingStore = await Store.findOne({
        where: { ownerId }
      });
      
      if (existingStore) {
        return res.status(400).json({ message: 'This user already owns a store' });
      }
    }
    
    const store = await Store.create({
      name,
      address,
      description,
      ownerId,
      averageRating: 0,
      totalRatings: 0
    });
    
    res.status(201).json({
      message: 'Store created successfully',
      store
    });
  } catch (error) {
    console.error('Create store error:', error);
    res.status(500).json({ message: 'Error creating store' });
  }
};

// Update store (admin or store owner)
exports.updateStore = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, address, description, ownerId } = req.body;
    
    // Check if store exists
    const store = await Store.findByPk(id);
    if (!store) {
      return res.status(404).json({ message: 'Store not found' });
    }
    
    // Check authorization (admin or store owner)
    if (req.user.role !== 'admin' && store.ownerId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this store' });
    }
    
    // If changing owner, verify new owner
    if (ownerId && ownerId !== store.ownerId) {
      // Only admin can change store owner
      if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Only admin can change store owner' });
      }
      
      const newOwner = await User.findByPk(ownerId);
      
      if (!newOwner) {
        return res.status(404).json({ message: 'New owner not found' });
      }
      
      // Update new owner's role to store_owner if not already
      if (newOwner.role !== 'store_owner') {
        await newOwner.update({ role: 'store_owner' });
      }
      
      // Check if new owner already has a store
      const existingStore = await Store.findOne({
        where: { ownerId, id: { [Op.ne]: id } }
      });
      
      if (existingStore) {
        return res.status(400).json({ message: 'This user already owns a store' });
      }
    }
    
    // Update fields
    const updateData = {};
    if (name) updateData.name = name;
    if (address) updateData.address = address;
    if (description !== undefined) updateData.description = description;
    if (ownerId && req.user.role === 'admin') updateData.ownerId = ownerId;
    
    await store.update(updateData);
    
    // Get updated store
    const updatedStore = await Store.findByPk(id, {
      include: [
        {
          model: User,
          as: 'owner',
          attributes: ['id', 'name', 'email']
        }
      ]
    });
    
    res.status(200).json({
      message: 'Store updated successfully',
      store: updatedStore
    });
  } catch (error) {
    console.error('Update store error:', error);
    res.status(500).json({ message: 'Error updating store' });
  }
};

// Delete store (admin only)
exports.deleteStore = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if store exists
    const store = await Store.findByPk(id);
    if (!store) {
      return res.status(404).json({ message: 'Store not found' });
    }
    
    // Start transaction
    const transaction = await sequelize.transaction();
    
    try {
      // Delete ratings associated with the store
      await Rating.destroy({
        where: { storeId: id },
        transaction
      });
      
      // Delete store
      await store.destroy({ transaction });
      
      // Commit transaction
      await transaction.commit();
      
      res.status(200).json({ message: 'Store deleted successfully' });
    } catch (error) {
      // Rollback transaction in case of error
      await transaction.rollback();
      throw error;
    }
  } catch (error) {
    console.error('Delete store error:', error);
    res.status(500).json({ message: 'Error deleting store' });
  }
};

// Get dashboard stats for admin
exports.getAdminStats = async (req, res) => {
  try {
    // Get counts
    const totalUsers = await User.count();
    const totalStores = await Store.count();
    const totalRatings = await Rating.count();
    
    // Get user counts by role
    const usersByRole = await User.findAll({
      attributes: [
        'role',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: ['role']
    });
    
    // Get top-rated stores
    const topStores = await Store.findAll({
      limit: 5,
      order: [
        ['averageRating', 'DESC'],
        ['totalRatings', 'DESC']
      ],
      include: [
        {
          model: User,
          as: 'owner',
          attributes: ['id', 'name']
        }
      ]
    });
    
    // Get recent ratings
    const recentRatings = await Rating.findAll({
      limit: 10,
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name']
        },
        {
          model: Store,
          as: 'store',
          attributes: ['id', 'name']
        }
      ]
    });
    
    res.status(200).json({
      stats: {
        totalUsers,
        totalStores,
        totalRatings,
        usersByRole
      },
      topStores,
      recentRatings
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    res.status(500).json({ message: 'Error getting admin stats' });
  }
}; 