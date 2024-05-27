'use server';

import { db, sessionParticipants } from '@sessions/web-db';

export async function addSessionParticipant(userId: string, sessionId: number) {
  return db.instance.insert(sessionParticipants).values({ sessionId, userId });
}
