import {
  integer,
  pgTable,
  serial,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const users = pgTable('users', {
  id: varchar('id', { length: 100 }).primaryKey(),
  email: varchar('email', { length: 100 }).notNull(),
  firstName: varchar('first_name', { length: 50 }).notNull(),
  lastName: varchar('last_name', { length: 50 }).notNull(),
  picture: varchar('picture', { length: 256 }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const usersRelations = relations(users, ({ many }) => ({
  sessionParticipants: many(sessionParticipants),
}));

export const sessions = pgTable('sessions', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  slug: varchar('slug', { length: 100 }).notNull(),
  hostId: varchar('host_id', { length: 100 })
    .references(() => users.id)
    .notNull(),
  startedAt: timestamp('started_at').notNull().defaultNow(),
  endedAt: timestamp('ended_at'),
});

export const sessionsRelations = relations(sessions, ({ many }) => ({
  sessionParticipants: many(sessionParticipants),
}));

export const sessionParticipants = pgTable(
  'session_participants',
  {
    sessionId: integer('session_id').references(() => sessions.id),
    userId: varchar('user_id', { length: 100 }).references(() => users.id),
  },
  () => ({
    primaryKey: {
      name: 'session_participants_pkey',
      columns: [sessions.id, users.id],
    },
  }),
);

export const sessionParticipantsRelations = relations(
  sessionParticipants,
  ({ one }) => ({
    session: one(sessions, {
      fields: [sessionParticipants.sessionId],
      references: [sessions.id],
    }),
    user: one(users, {
      fields: [sessionParticipants.userId],
      references: [users.id],
    }),
  }),
);
