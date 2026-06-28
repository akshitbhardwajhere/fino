import { pgTable, uuid, text, numeric, timestamp, jsonb, varchar, date, index } from 'drizzle-orm/pg-core';

export const expenses = pgTable('expenses', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: varchar('user_id', { length: 256 }),
  amount: numeric('amount', { precision: 10, scale: 2 }).notNull(),
  category: varchar('category', { length: 100 }).notNull(),
  description: text('description'),
  spentAt: timestamp('spent_at', { withTimezone: true }).defaultNow().notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index('expenses_user_id_idx').on(table.userId),
  index('expenses_user_id_spent_at_idx').on(table.userId, table.spentAt),
]);

export const messageLogs = pgTable('message_logs', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: varchar('user_id', { length: 256 }),
  incomingMessage: text('incoming_message').notNull(),
  parsedJson: jsonb('parsed_json'),
  intent: varchar('intent', { length: 50 }),
  response: text('response'),
  status: varchar('status', { length: 50 }).default('pending').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index('message_logs_user_id_idx').on(table.userId),
  index('message_logs_user_id_created_at_idx').on(table.userId, table.createdAt),
]);

export const dailySummaries = pgTable('daily_summaries', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: varchar('user_id', { length: 256 }),
  date: date('date').notNull(),
  total: numeric('total', { precision: 10, scale: 2 }).notNull(),
  summary: text('summary').notNull(),
  sentAt: timestamp('sent_at', { withTimezone: true }),
}, (table) => [
  index('daily_summaries_user_id_idx').on(table.userId),
  index('daily_summaries_user_id_date_idx').on(table.userId, table.date),
]);

export const settings = pgTable('settings', {
  id: varchar('id', { length: 256 }).primaryKey(),
  aiProvider: varchar('ai_provider', { length: 50 }).default('groq').notNull(),
  timezone: varchar('timezone', { length: 100 }).default('Asia/Kolkata').notNull(),
  currency: varchar('currency', { length: 50 }).default('INR (₹)').notNull(),
  summaryTime: varchar('summary_time', { length: 5 }).default('23:00').notNull(),
  whatsappJid: varchar('whatsapp_jid', { length: 256 }),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});
