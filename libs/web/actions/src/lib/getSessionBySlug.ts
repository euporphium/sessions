'use server';

import { db } from '@sessions/web-db';

export async function getSessionBySlug(slug: string) {
  return db.instance.query.sessions.findFirst({
    where: (sessions, { eq }) => eq(sessions.slug, slug),
    with: { sessionParticipants: true },
  });
}
