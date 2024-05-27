'use server';

import { redirect } from 'next/navigation';
import { z } from 'zod';
import { getAuthenticatedUser } from '@sessions/web-actions';
import { db, sessionParticipants, sessions } from '@sessions/web-db';

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

  const result = await db.instance.transaction(async (trx) => {
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
