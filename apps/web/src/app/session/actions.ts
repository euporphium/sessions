'use server';

import { redirect } from 'next/navigation';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { z } from 'zod';
import db, { sessionParticipants, sessions } from '../../../db';

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
    const activeWithSlug = await trx.query.sessions.findFirst({
      where: (sessions, { eq }) =>
        eq(sessions.active, true) &&
        eq(sessions.slug, validatedFormData.data.slug),
    });

    if (activeWithSlug) {
      trx.rollback();
      return { errors: { slug: ['Slug already in use'] } };
    }

    const [{ sessionId, slug }] = await trx
      .insert(sessions)
      .values({
        ...validatedFormData.data,
        createdBy: user.id,
      })
      .returning({ sessionId: sessions.id, slug: sessions.slug });

    await trx.insert(sessionParticipants).values({
      sessionId,
      userId: user.id,
      isHost: true,
    });

    return { slug };
  });

  redirect(`/session/${result.slug}`);
}
