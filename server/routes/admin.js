router.get('/stores/search', async (req, res) => {
  try {
    const { name, address, email, rating, role } = req.query;
    
    let query = {};
    
    // Store search filters
    if (name) {
      query.name = { $regex: name, $options: 'i' };
    }
    if (address) {
      query.address = { $regex: address, $options: 'i' };
    }
    if (rating) {
      query.averageRating = { $gte: parseFloat(rating) };
    }

    // User search filters
    if (email) {
      query.email = { $regex: email, $options: 'i' };
    }
    if (role) {
      query.role = role;
    }

    const stores = await Store.find(query)
      .select('name address averageRating email role')
      .sort({ averageRating: -1 });
    
    res.json(stores);
  } catch (error) {
    res.status(500).json({ message: 'Error searching', error: error.message });
  }
});