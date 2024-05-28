import { defineConfig } from 'drizzle-kit';
import { env } from './src/env';

export default defineConfig({
  dialect: 'postgresql',
  schema: '../../libs/web/db/src/lib/schema.ts',
  out: '../../libs/web/db/migrations',
  dbCredentials: {
    host: env.server.POSTGRES_HOST,
    port: +env.server.POSTGRES_PORT,
    database: env.server.POSTGRES_DB,
    user: env.server.POSTGRES_USER,
    password: env.server.POSTGRES_PASSWORD,
  },
});
