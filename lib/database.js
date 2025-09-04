import mysql from 'mysql2/promise';

// This code creates a "connection pool" to the database.
// It's more efficient than creating a new connection for every single query.
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// This is our reusable utility function.
// Any part of our app can now import and use this function to talk to the database.
export async function query({ query, values = [] }) {
  try {
    const [results] = await pool.execute(query, values);
    return results;
  } catch (error) {
    console.error("Database Query Error:", error.message);
    throw new Error("Failed to execute database query.");
  }
}