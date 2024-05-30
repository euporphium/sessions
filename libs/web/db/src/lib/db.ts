import { drizzle, type PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

let _db: PostgresJsDatabase<typeof schema>;

export function initializePostgresDatabase(options: postgres.Options<{}>) {
  if (!_db) {
    _db = drizzle(postgres(options), { schema });
  }

  return _db;
}

export const db = {
  get instance() {
    if (!_db) {
      throw new Error('Database not initialized');
    }
    return _db;
  },
};
