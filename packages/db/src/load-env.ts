import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { config } from 'dotenv';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
config({ path: path.join(repoRoot, '.env') });

const inDocker = fs.existsSync('/.dockerenv');
const password = process.env.POSTGRES_PASSWORD;

if (password && !inDocker) {
  const user = process.env.POSTGRES_USER ?? 'comam';
  const dbName = process.env.POSTGRES_DB ?? 'comam';
  process.env.DATABASE_URL = `postgresql://${user}:${password}@localhost:5432/${dbName}`;
}
