import { drizzle, type PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import * as schema from './schema';

let _db: PostgresJsDatabase<typeof schema>;

export async function initializePostgresDatabase(
  options: postgres.Options<{}>,
  migrationsFolder: string,
) {
  if (!_db) {
    _db = drizzle(postgres(options), { schema });
    await migrate(_db, { migrationsFolder });
  }
}

export const db = {
  get instance() {
    if (!_db) {
      throw new Error('Database not initialized');
    }
    return _db;
  },
};
