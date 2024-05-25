import { defineConfig } from 'drizzle-kit';
import env from './env';

export default defineConfig({
  dialect: 'postgresql',
  schema: './db/schema.ts',
  out: './db/migrations',
  dbCredentials: {
    host: env.POSTGRES_HOST,
    user: env.POSTGRES_USER,
    password: env.POSTGRES_PASSWORD,
    database: env.POSTGRES_DB,
  },
});
