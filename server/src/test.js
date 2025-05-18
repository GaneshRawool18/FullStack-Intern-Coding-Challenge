import { query } from './config/db.js';

// Simple function to test database connection
async function testConnection() {
  try {
    // Try to connect and run a simple query
    const result = await query('SELECT NOW()');
    console.log('Database connection successful!');
    console.log('Current time in database:', result.rows[0].now);
  } catch (err) {
    console.error('Database connection failed!');
    console.error('Error:', err.message);
  }
}

// Run the test
testConnection(); 