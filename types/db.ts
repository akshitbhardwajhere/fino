import { type InferSelectModel, type InferInsertModel } from 'drizzle-orm';
import { expenses, messageLogs, dailySummaries, settings } from '@/lib/db/schema';

export type Expense = InferSelectModel<typeof expenses>;
export type NewExpense = InferInsertModel<typeof expenses>;

export type MessageLog = InferSelectModel<typeof messageLogs>;
export type NewMessageLog = InferInsertModel<typeof messageLogs>;

export type DailySummary = InferSelectModel<typeof dailySummaries>;
export type NewDailySummary = InferInsertModel<typeof dailySummaries>;

export type Settings = InferSelectModel<typeof settings>;
export type NewSettings = InferInsertModel<typeof settings>;
