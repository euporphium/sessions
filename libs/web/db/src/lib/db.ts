import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

export function getDbClient(options: postgres.Options<{}>) {
  return drizzle(postgres(options), { schema });
}
