import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';

// Initialize PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

// Create drizzle instance with all schema tables
export const db = drizzle(pool, { schema });

// Export a function to run migrations programmatically if needed
export async function runMigrations() {
  // This is a placeholder for migration logic
  // You can use drizzle-kit or another migration tool
  console.log('Running migrations...');
}

// Export a function to close the database connection
export async function closeDatabase() {
  await pool.end();
}

// Export schema for convenience
export * from './schema';
