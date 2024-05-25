import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import * as schema from './schema';
import env from '../env';

const url = `postgres://${env.POSTGRES_USER}:${env.POSTGRES_PASSWORD}@${env.POSTGRES_HOST}/${env.POSTGRES_DB}`;

const queryClient = postgres(url);
const db = drizzle(queryClient, { schema });

export default db;

export * from './schema';
