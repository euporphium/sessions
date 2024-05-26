import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import * as schema from './schema';
import { env } from '../src/env';

const url = `postgres://${env.server.POSTGRES_USER}:${env.server.POSTGRES_PASSWORD}@${env.server.POSTGRES_HOST}/${env.server.POSTGRES_DB}`;

const queryClient = postgres(url);
const db = drizzle(queryClient, { schema });

export default db;

export * from './schema';
