import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/fino';

declare global {
  // eslint-disable-next-line no-var
  var postgresClient: ReturnType<typeof postgres> | undefined;
}

// Disable pre-prepared statements for Supabase connection pooling compatibility
export const client = globalThis.postgresClient || postgres(connectionString, { prepare: false });

if (process.env.NODE_ENV !== 'production') {
  globalThis.postgresClient = client;
}

export const db = drizzle(client);
