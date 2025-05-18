const db = require('./config/pg.config');

console.log('Testing database connection...');

// Simple query to test connection
db.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Database connection error:', err.message);
    process.exit(1);
  } else {
    console.log('Database connection successful!');
    console.log('Current timestamp from database:', res.rows[0].now);
    process.exit(0);
  }
}); 