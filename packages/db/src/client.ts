import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const connectionString =
  process.env.DATABASE_URL ?? 'postgresql://comam:change_me@localhost:5432/comam';

const client = postgres(connectionString, { max: 10 });

export const db = drizzle(client, { schema });

export async function closeDb() {
  await client.end();
}

export type Database = typeof db;
