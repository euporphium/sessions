import {
  boolean,
  pgTable,
  serial,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: varchar('id', { length: 100 }).primaryKey(),
  email: varchar('email', { length: 100 }).notNull(),
  firstName: varchar('first_name', { length: 50 }).notNull(),
  lastName: varchar('last_name', { length: 50 }).notNull(),
  picture: varchar('picture', { length: 256 }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const sessions = pgTable('sessions', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  slug: varchar('slug', { length: 100 }).notNull(),
  active: boolean('active').notNull().default(true),
  createdBy: varchar('created_by', { length: 100 })
    .references(() => users.id)
    .notNull(),
  startedAt: timestamp('started_at').notNull().defaultNow(),
  endedAt: timestamp('ended_at'),
});
