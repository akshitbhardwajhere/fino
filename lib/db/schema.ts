import { pgTable, uuid, text, numeric, timestamp, jsonb, varchar, date } from 'drizzle-orm/pg-core';

export const expenses = pgTable('expenses', {
  id: uuid('id').defaultRandom().primaryKey(),
  amount: numeric('amount', { precision: 10, scale: 2 }).notNull(),
  category: varchar('category', { length: 100 }).notNull(),
  description: text('description'),
  spentAt: timestamp('spent_at', { withTimezone: true }).defaultNow().notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export const messageLogs = pgTable('message_logs', {
  id: uuid('id').defaultRandom().primaryKey(),
  incomingMessage: text('incoming_message').notNull(),
  parsedJson: jsonb('parsed_json'),
  intent: varchar('intent', { length: 50 }),
  response: text('response'),
  status: varchar('status', { length: 50 }).default('pending').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const dailySummaries = pgTable('daily_summaries', {
  id: uuid('id').defaultRandom().primaryKey(),
  date: date('date').notNull(),
  total: numeric('total', { precision: 10, scale: 2 }).notNull(),
  summary: text('summary').notNull(),
  sentAt: timestamp('sent_at', { withTimezone: true }),
});
