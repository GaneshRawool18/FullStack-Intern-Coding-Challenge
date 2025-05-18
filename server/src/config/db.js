import pg from 'pg';
const { Client } = pg;

// Create a new client
const client = new Client({
  user: 'postgres',
  password: 'mysecretpassword', // Use your actual password
  host: 'localhost',
  database: 'ratemystore',
  port: 5432
});

// Connect to the database
client.connect()
  .then(() => {
    console.log('Successfully connected to database!');
  })
  .catch(err => {
    console.error('Error connecting to the database:', err.message);
  });

// Export a function to run queries
export const query = async (text, params) => {
  try {
    const result = await client.query(text, params);
    return result;
  } catch (err) {
    console.error('Error executing query:', err.message);
    throw err;
  }
}; 

export default client;