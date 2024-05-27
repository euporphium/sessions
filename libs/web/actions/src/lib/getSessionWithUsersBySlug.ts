'use server';

import { db } from '@sessions/web-db';

export async function getSessionWithUsersBySlug(slug: string) {
  const session = await db.instance.query.sessions.findFirst({
    where: (sessions, { and, eq, isNull }) =>
      and(eq(sessions.slug, slug), isNull(sessions.endedAt)),
    with: {
      sessionParticipants: {
        with: {
          user: true,
        },
      },
    },
  });

  if (!session) {
    return null;
  }

  const { sessionParticipants, ...rest } = session;

  return {
    ...rest,
    users: sessionParticipants.map((p) => ({ ...p.user, role: p.role })),
  };
}
