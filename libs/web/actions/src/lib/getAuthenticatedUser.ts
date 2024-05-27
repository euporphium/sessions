'use server';

import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { db } from '@sessions/web-db';

export async function getAuthenticatedUser() {
  const { getUser } = getKindeServerSession();
  const kindeUser = await getUser();

  if (!kindeUser) {
    return null;
  }

  const user = await db.instance.query.users.findFirst({
    where: (users, { eq }) => eq(users.id, kindeUser.id),
  });

  return user ?? null;
}
