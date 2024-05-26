import postgres from 'postgres';
import { env } from '../src/env';

const url = `postgres://${env.server.POSTGRES_USER}:${env.server.POSTGRES_PASSWORD}@${env.server.POSTGRES_HOST}/${env.server.POSTGRES_DB}`;

let postgresClientSingleton: postgres.Sql;

const getPostgresClient = () => {
  if (!postgresClientSingleton) {
    console.log('Creating PostgreSQL client');
    postgresClientSingleton = postgres(url);
  }
  return postgresClientSingleton;
};

export default getPostgresClient;
