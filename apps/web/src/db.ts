import { env } from './env';
import { getDbClient } from '@sessions/web-db';

console.log('Doing database stuff...');

const db = getDbClient({
  host: env.POSTGRES_HOST,
  port: env.POSTGRES_PORT,
  database: env.POSTGRES_DB,
  username: env.POSTGRES_USER,
  password: env.POSTGRES_PASSWORD,
});

export { db };
