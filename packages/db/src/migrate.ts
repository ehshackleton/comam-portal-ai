import './load-env';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';

const connectionString =
  process.env.DATABASE_URL ?? 'postgresql://comam:change_me@localhost:5432/comam';

const client = postgres(connectionString, { max: 1 });
const db = drizzle(client);

const migrationsFolder = path.join(path.dirname(fileURLToPath(import.meta.url)), '../drizzle');

await migrate(db, { migrationsFolder });
await client.end();

console.log('Migraciones aplicadas.');
