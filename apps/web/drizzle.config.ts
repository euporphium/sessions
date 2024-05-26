import { defineConfig } from 'drizzle-kit';
import { env } from './src/env';

export default defineConfig({
  dialect: 'postgresql',
  schema: './db/schema.ts',
  out: './db/migrations',
  dbCredentials: {
    host: env.server.POSTGRES_HOST,
    user: env.server.POSTGRES_USER,
    password: env.server.POSTGRES_PASSWORD,
    database: env.server.POSTGRES_DB,
  },
});
