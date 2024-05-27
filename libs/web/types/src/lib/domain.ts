import { createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import { sessionParticipants, sessions, users } from '@sessions/web-db';

const sessionParticipantSelectSchema = createSelectSchema(sessionParticipants);
type SessionParticipant = z.infer<typeof sessionParticipantSelectSchema>;

export const sessionSelectSchema = createSelectSchema(sessions, {});
export type Session = z.infer<typeof sessionSelectSchema>;

export type SessionWithParticipants = Session & {
  sessionParticipants: SessionParticipant[];
};

export const userSelectSchema = createSelectSchema(users);
export type User = z.infer<typeof userSelectSchema>;
