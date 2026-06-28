import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/fino';

// Disable pre-prepared statements for Supabase connection pooling compatibility
export const client = postgres(connectionString, { prepare: false });
export const db = drizzle(client);
