const { Pool } = require('pg');
require('dotenv').config(); // Load environment variables from .env file

// Create a new pool instance for PostgreSQL
const pool = new Pool({
    user: process.env.DB_USER, // Use environment variable
    host: process.env.DB_HOST, // Use environment variable
    database: process.env.DB_NAME, // Use environment variable
    password: process.env.DB_PASSWORD, // Use environment variable
    port: process.env.DB_PORT, // Use environment variable
});

// Function to query the database
const query = (text, params) => pool.query(text, params);

// Export the query function
module.exports = {
    query,
};
