import { drizzle } from 'drizzle-orm/postgres-js';
import getInstance from './postgresClientSingleton';
import * as schema from './schema';

const db = drizzle(getInstance(), { schema });

export default db;

export * from './schema';
