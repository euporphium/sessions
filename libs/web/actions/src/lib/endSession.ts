'use server';

import { sessions } from '@sessions/web-db';
import { eq } from 'drizzle-orm';
import { db } from '../../../../../apps/web/src/db';

export async function endSession(id: number) {
  return db
    .update(sessions)
    .set({ endedAt: new Date() })
    .where(eq(sessions.id, id))
    .returning({ slug: sessions.slug });
}
