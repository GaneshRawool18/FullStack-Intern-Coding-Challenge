const bcrypt = require('bcryptjs');
const { User, Store, Rating, sequelize } = require('../models');
const { Op } = require('sequelize');

// Get all users (admin only)
exports.getAllUsers = async (req, res) => {
  try {
    const { search, role, limit = 10, page = 1 } = req.query;
    const offset = (page - 1) * limit;
    
    const whereClause = {};
    
    // Search filter
    if (search) {
      whereClause[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } },
        { address: { [Op.iLike]: `%${search}%` } }
      ];
    }
    
    // Role filter
    if (role) {
      whereClause.role = role;
    }
    
    const { count, rows: users } = await User.findAndCountAll({
      where: whereClause,
      attributes: { exclude: ['password'] },
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']]
    });
    
    res.status(200).json({
      users,
      totalUsers: count,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page)
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ message: 'Error getting users' });
  }
};

// Get user by ID (admin only)
exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const user = await User.findByPk(id, {
      attributes: { exclude: ['password'] },
      include: [
        {
          model: Store,
          as: 'ownedStore',
          required: false
        }
      ]
    });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.status(200).json({ user });
  } catch (error) {
    console.error('Get user by ID error:', error);
    res.status(500).json({ message: 'Error getting user' });
  }
};

// Create new user (admin only)
exports.createUser = async (req, res) => {
  try {
    const { name, email, password, address, role } = req.body;
    
    // Check if email already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      address,
      role: role || 'user'
    });
    
    const userResponse = {
      id: user.id,
      name: user.name,
      email: user.email,
      address: user.address,
      role: user.role,
      createdAt: user.createdAt
    };
    
    res.status(201).json({
      message: 'User created successfully',
      user: userResponse
    });
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ message: 'Error creating user' });
  }
};

// Update user (admin or self)
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, address, role } = req.body;
    
    // Check if user exists
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Only allow admin to update role or update other users
    if (req.user.id !== parseInt(id) && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this user' });
    }
    
    // Check if email is being changed and if it's already in use
    if (email && email !== user.email) {
      const emailExists = await User.findOne({ where: { email } });
      if (emailExists) {
        return res.status(400).json({ message: 'Email already in use' });
      }
    }
    
    // Update fields
    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (address) updateData.address = address;
    
    // Only admin can change role
    if (role && req.user.role === 'admin') {
      updateData.role = role;
    }
    
    await user.update(updateData);
    
    // Get updated user
    const updatedUser = await User.findByPk(id, {
      attributes: { exclude: ['password'] }
    });
    
    res.status(200).json({
      message: 'User updated successfully',
      user: updatedUser
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ message: 'Error updating user' });
  }
};

// Delete user (admin only)
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if user exists
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Start transaction
    const transaction = await sequelize.transaction();
    
    try {
      // Delete related ratings
      await Rating.destroy({
        where: { userId: id },
        transaction
      });
      
      // Delete owned store
      await Store.destroy({
        where: { ownerId: id },
        transaction
      });
      
      // Delete user
      await user.destroy({ transaction });
      
      // Commit transaction
      await transaction.commit();
      
      res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
      // Rollback transaction in case of error
      await transaction.rollback();
      throw error;
    }
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Error deleting user' });
  }
};

// Get user's dashboard stats
exports.getUserStats = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // For store owners, get their store's ratings
    if (req.user.role === 'store_owner') {
      const store = await Store.findOne({
        where: { ownerId: userId },
        include: [
          {
            model: Rating,
            as: 'ratings',
            include: [
              {
                model: User,
                as: 'user',
                attributes: ['id', 'name', 'email']
              }
            ]
          }
        ]
      });
      
      if (!store) {
        return res.status(404).json({ message: 'No store found for this owner' });
      }
      
      return res.status(200).json({
        role: 'store_owner',
        store: {
          id: store.id,
          name: store.name,
          address: store.address,
          description: store.description,
          averageRating: store.averageRating,
          totalRatings: store.totalRatings
        },
        ratings: store.ratings
      });
    }
    
    // For normal users, get their submitted ratings
    const ratings = await Rating.findAll({
      where: { userId },
      include: [
        {
          model: Store,
          as: 'store'
        }
      ]
    });
    
    res.status(200).json({
      role: req.user.role,
      ratings
    });
  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({ message: 'Error getting user stats' });
  }
}; 