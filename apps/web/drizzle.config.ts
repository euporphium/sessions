import { defineConfig } from 'drizzle-kit';
import { env } from './src/env';

export default defineConfig({
  dialect: 'postgresql',
  schema: '../../libs/web/db/src/lib/schema.ts',
  out: '../../libs/web/db/migrations',
  dbCredentials: {
    host: env.POSTGRES_HOST,
    port: +env.POSTGRES_PORT,
    database: env.POSTGRES_DB,
    user: env.POSTGRES_USER,
    password: env.POSTGRES_PASSWORD,
  },
});
