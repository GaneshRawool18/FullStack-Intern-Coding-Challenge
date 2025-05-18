import db from '../config/db.js';

import bcrypt from 'bcryptjs';

// Function to create all required tables
async function setupDatabase() {
  try {
    console.log('Starting database setup...');

    // Drop existing users table if the column structure doesn't match what we need
    try {
      const checkColumns = await query(`
        SELECT column_name FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'username'
      `);

      if (checkColumns.rows.length === 0) {
        console.log('Username column not found. Recreating users table...');
        await query('DROP TABLE IF EXISTS ratings CASCADE');
        await query('DROP TABLE IF EXISTS stores CASCADE');
        await query('DROP TABLE IF EXISTS users CASCADE');
      }
    } catch (err) {
      console.log('Tables may not exist yet, continuing with setup');
    }

    // Create users table
    await query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(100) UNIQUE NOT NULL,
        username VARCHAR(50) NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(20) NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin', 'store_owner')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Users table created or exists');

    // Create stores table
    await query(`
      CREATE TABLE IF NOT EXISTS stores (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        address TEXT NOT NULL,
        description TEXT,
        owner_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
        average_rating NUMERIC(3,2) DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Stores table created or exists');

    // Create ratings table
    await query(`
      CREATE TABLE IF NOT EXISTS ratings (
        id SERIAL PRIMARY KEY,
        store_id INTEGER REFERENCES stores(id) ON DELETE CASCADE,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
        comment TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(store_id, user_id)
      )
    `);
    console.log('Ratings table created or exists');

    // Create default users if they don't exist
    // 1. Admin with admin.ratemystore.com domain
    const adminCheck = await query(
      'SELECT id FROM users WHERE email = $1',
      ['admin@ratemystore.com']
    );

    if (adminCheck.rows.length === 0) {
      // Hash admin password
      const salt = await bcrypt.genSalt(10);
      const adminPassword = await bcrypt.hash('admin123', salt);

      await query(
        `INSERT INTO users (username, email, password, role) 
         VALUES ($1, $2, $3, $4)`,
        ['Admin', 'admin@ratemystore.com', adminPassword, 'admin']
      );
      console.log('System Administrator created with email: admin@ratemystore.com, password: admin123');
    } else {
      console.log('System Administrator already exists');
    }

    // 2. Store Owner with owner.ratemystore.com domain
    const ownerCheck = await query(
      'SELECT id FROM users WHERE email = $1',
      ['owner@ratemystore.com']
    );

    if (ownerCheck.rows.length === 0) {
      // Hash store owner password
      const salt = await bcrypt.genSalt(10);
      const ownerPassword = await bcrypt.hash('owner123', salt);

      await query(
        `INSERT INTO users (username, email, password, role) 
         VALUES ($1, $2, $3, $4)`,
        ['StoreOwner', 'owner@ratemystore.com', ownerPassword, 'store_owner']
      );
      console.log('Store Owner created with email: owner@ratemystore.com, password: owner123');
    } else {
      console.log('Store Owner already exists');
    }

    // 3. Regular user for testing
    const userCheck = await query(
      'SELECT id FROM users WHERE email = $1',
      ['user@example.com']
    );

    if (userCheck.rows.length === 0) {
      // Hash user password
      const salt = await bcrypt.genSalt(10);
      const userPassword = await bcrypt.hash('user123', salt);

      await query(
        `INSERT INTO users (username, email, password, role) 
         VALUES ($1, $2, $3, $4)`,
        ['User', 'user@example.com', userPassword, 'user']
      );
      console.log('Regular User created with email: user@example.com, password: user123');
    } else {
      console.log('Regular User already exists');
    }

    console.log('Database setup completed successfully!');
  } catch (err) {
    console.error('Database setup error:', err);
  }
}

// Export but don't automatically run
export default setupDatabase;

