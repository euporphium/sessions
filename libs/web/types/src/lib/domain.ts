import { users } from '@sessions/web-db';
import { createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

export const userSelectSchema = createSelectSchema(users);
export type User = z.infer<typeof userSelectSchema>;
