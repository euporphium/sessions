'use server';

import { sessionParticipants } from '@sessions/web-db';
import { db } from '../../../../../apps/web/src/db';

export async function addSessionParticipant(userId: string, sessionId: number) {
  return db.insert(sessionParticipants).values({ sessionId, userId });
}
