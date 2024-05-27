'use server';

import { db, sessions } from '@sessions/web-db';
import { eq } from 'drizzle-orm';

export async function endSession(id: number) {
  return db.instance
    .update(sessions)
    .set({ endedAt: new Date() })
    .where(eq(sessions.id, id))
    .returning({ slug: sessions.slug });
}
