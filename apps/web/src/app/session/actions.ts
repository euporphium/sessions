'use server';

import { redirect } from 'next/navigation';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { z } from 'zod';
import db, { sessions, sessionParticipants } from '../../../db';
import { eq } from 'drizzle-orm';

export async function getAuthenticatedUser() {
  const { getUser } = getKindeServerSession();
  const kindeUser = await getUser();

  if (!kindeUser) {
    return null;
  }

  const user = await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.id, kindeUser.id),
  });

  return user ?? null;
}

export async function getUserSessions(userId: string) {
  return db.query.sessionParticipants.findMany({
    where: (sessionParticipants, { eq }) =>
      eq(sessionParticipants.userId, userId),
    with: { session: true },
  });
}

export async function getSessionBySlug(slug: string) {
  return db.query.sessions.findFirst({
    where: (sessions, { eq }) => eq(sessions.slug, slug),
    with: { sessionParticipants: true },
  });
}

export async function createSession(formData: FormData) {
  const user = await getAuthenticatedUser();
  if (!user) {
    throw new Error('Unable to find authenticated user');
  }

  // Matches slugs with lowercase letters, numbers, and hyphens, starting and ending with alphanumeric characters, and no consecutive hyphens.
  const slugRegex = /^[a-z0-9]+(-[a-z0-9]+)*$/;

  const createSessionSchema = z.object({
    name: z.string().trim().min(1, { message: 'Required' }).max(100),
    // TODO: form lib should do coercion - remove when available
    maxParticipants: z.string().min(1).pipe(z.coerce.number()),
    slug: z.string().regex(slugRegex),
  });

  const rawFormData = {
    name: formData.get('name'),
    maxParticipants: formData.get('maxParticipants'),
    slug: formData.get('slug'),
  };

  const validatedFormData = createSessionSchema.safeParse(rawFormData);
  if (!validatedFormData.success) {
    const err = { errors: validatedFormData.error.flatten().fieldErrors };
    console.error(err);
    return err;
  }

  const result = await db.transaction(async (trx) => {
    // Check if the slug is currently in use
    const activeWithSlug = await trx.query.sessions.findFirst({
      where: (sessions, { eq, isNull, and }) =>
        and(
          eq(sessions.slug, validatedFormData.data.slug),
          isNull(sessions.endedAt),
        ),
    });

    // If the slug is in use, return an error
    if (activeWithSlug) {
      trx.rollback();
      return { errors: { slug: ['Slug already in use'] } };
    }

    // Create the session
    const [{ sessionId, slug }] = await trx
      .insert(sessions)
      .values(validatedFormData.data)
      .returning({ sessionId: sessions.id, slug: sessions.slug });

    await trx.insert(sessionParticipants).values({
      sessionId,
      userId: user.id,
      role: 'admin',
    });

    return { slug };
  });

  redirect(`/session/${result.slug}`);
}

export async function endSession(id: number) {
  return db
    .update(sessions)
    .set({ endedAt: new Date() })
    .where(eq(sessions.id, id))
    .returning({ slug: sessions.slug });
}

export async function addParticipant(sessionId: number, userId: string) {
  return db.insert(sessionParticipants).values({ sessionId, userId });
}
