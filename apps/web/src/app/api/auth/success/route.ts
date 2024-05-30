import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { type NextRequest, NextResponse } from 'next/server';
import { db, users } from '@sessions/web-db';
import { z } from 'zod';
import { env } from '../../../../env';

export const dynamic = 'force-dynamic';

// TODO: move to a shared location - 😎
function nullify(value: unknown) {
  if (typeof value === 'string') {
    value = value.trim();
  }
  return value || null;
}

const kindeUserSchema = z.object({
  id: z.string().min(1),
  given_name: z.string().min(1),
  family_name: z.string().min(1),
  email: z.string().email(),
  picture: z.preprocess(nullify, z.string().url().nullish()),
});

export async function GET(request: NextRequest) {
  const { getUser } = getKindeServerSession();
  const kindeUser = await getUser();

  const validatedUser = kindeUserSchema.safeParse(kindeUser);

  if (!validatedUser.success) {
    throw new Error('Unable to validate user data');
  }

  const dbUser = await db.instance.query.users.findFirst({
    where: (users, { eq }) => eq(users.id, validatedUser.data.id),
  });

  if (!dbUser) {
    console.log('User not found in the database - creating a new user');

    await db.instance.insert(users).values({
      id: validatedUser.data.id,
      firstName: validatedUser.data.given_name,
      lastName: validatedUser.data.family_name,
      email: validatedUser.data.email,
      picture: validatedUser.data.picture,
    });
  }

  return NextResponse.redirect(
    request.nextUrl.searchParams.get('next') ?? env.BASE_URL,
  );
}
