import { NextResponse, type NextRequest } from 'next/server';
import { getDbClient } from '@sessions/web-db';
import { env } from '../../../env';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const token = await request.text();

  if (token !== env.DB_INIT_TOKEN) {
    console.warn('Invalid attempt to initialize database');

    return NextResponse.json({
      message: "You didn't say the magic word",
      status: 401,
    });
  }

  getDbClient({
    host: env.POSTGRES_HOST,
    port: +env.POSTGRES_PORT, // TODO? Do better. Zod transform?
    username: env.POSTGRES_USER,
    password: env.POSTGRES_PASSWORD,
    database: env.POSTGRES_DB,
  });

  return NextResponse.json({ message: 'Database initialized' });
}
