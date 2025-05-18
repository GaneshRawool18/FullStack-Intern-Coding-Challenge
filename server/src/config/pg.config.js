const { Pool } = require('pg');
require('dotenv').config();

// Create connection pool
const pool = new Pool({
  user: process.env.DB_USERNAME || 'postgres',
  password: '@virat18',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_DATABASE || 'ratemystore',
  port: process.env.DB_PORT || 5432
});

// Test database connection
pool.connect((err, client, done) => {
  if (err) {
    console.error('Database connection error:', err.message);
  } else {
    console.log('Database connected successfully');
    done();
  }
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool
}; 