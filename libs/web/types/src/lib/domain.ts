import { createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import { sessionParticipants, sessions, users } from '@sessions/web-db';

const sessionParticipantSelectSchema = createSelectSchema(sessionParticipants);
export const sessionSelectSchema = createSelectSchema(sessions, {});
export const userSelectSchema = createSelectSchema(users);

export type User = z.infer<typeof userSelectSchema>;

export type SessionWithUsers = Session & {
  users: Array<User & { role: string }>;
};

export type Session = z.infer<typeof sessionSelectSchema>;

export type AccessRequest = {
  roomId: string;
  userId: string;
  userName: string;
};
