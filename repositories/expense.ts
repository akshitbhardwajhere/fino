import { db } from '@/lib/db/client';
import { expenses } from '@/lib/db/schema';
import { type Expense, type NewExpense } from '@/types/db';
import { eq, and, gte, lte, ilike, sql } from 'drizzle-orm';

export class ExpenseRepository {
  /**
   * Create a new expense record in the database
   */
  async create(data: NewExpense): Promise<Expense> {
    const [expense] = await db.insert(expenses).values(data).returning();
    return expense;
  }

  /**
   * Retrieve an expense by its unique UUID and user ID
   */
  async findById(id: string, userId: string): Promise<Expense | undefined> {
    const [expense] = await db
      .select()
      .from(expenses)
      .where(and(eq(expenses.id, id), eq(expenses.userId, userId)))
      .limit(1);
    return expense;
  }

  /**
   * Find all expenses with optional filtering (category, date range, description search) scoped to user
   */
  async findAll(filters?: {
    userId?: string;
    category?: string;
    startDate?: Date;
    endDate?: Date;
    search?: string;
  }): Promise<Expense[]> {
    const conditions = [];

    if (filters?.userId) {
      conditions.push(eq(expenses.userId, filters.userId));
    }

    if (filters?.category) {
      conditions.push(eq(expenses.category, filters.category));
    }

    if (filters?.startDate) {
      conditions.push(gte(expenses.spentAt, filters.startDate));
    }

    if (filters?.endDate) {
      conditions.push(lte(expenses.spentAt, filters.endDate));
    }

    if (filters?.search) {
      conditions.push(ilike(expenses.description, `%${filters.search}%`));
    }

    const query = db.select().from(expenses);

    if (conditions.length > 0) {
      return query.where(and(...conditions)).orderBy(sql`${expenses.spentAt} DESC`);
    }

    return query.orderBy(sql`${expenses.spentAt} DESC`);
  }

  /**
   * Update an existing expense record
   */
  async update(id: string, userId: string, data: Partial<NewExpense>): Promise<Expense | undefined> {
    const [updated] = await db
      .update(expenses)
      .set({ ...data, updatedAt: new Date() })
      .where(and(eq(expenses.id, id), eq(expenses.userId, userId)))
      .returning();
    return updated;
  }

  /**
   * Delete an expense by UUID and user ID
   */
  async delete(id: string, userId: string): Promise<boolean> {
    const result = await db
      .delete(expenses)
      .where(and(eq(expenses.id, id), eq(expenses.userId, userId)))
      .returning();
    return result.length > 0;
  }

  /**
   * Get total spending grouped by categories in a specific date range for a user
   */
  async getTotalsGroupedByCategory(
    userId: string,
    startDate?: Date,
    endDate?: Date
  ): Promise<{ category: string; total: string }[]> {
    const conditions = [eq(expenses.userId, userId)];

    if (startDate) {
      conditions.push(gte(expenses.spentAt, startDate));
    }

    if (endDate) {
      conditions.push(lte(expenses.spentAt, endDate));
    }

    const query = db
      .select({
        category: expenses.category,
        total: sql<string>`sum(${expenses.amount})`,
      })
      .from(expenses)
      .groupBy(expenses.category);

    return query.where(and(...conditions));
  }

  /**
   * Get total spending sum in a specific date range for a user
   */
  async getTotalSpending(userId: string, startDate?: Date, endDate?: Date): Promise<string> {
    const conditions = [eq(expenses.userId, userId)];

    if (startDate) {
      conditions.push(gte(expenses.spentAt, startDate));
    }

    if (endDate) {
      conditions.push(lte(expenses.spentAt, endDate));
    }

    const query = db
      .select({
        total: sql<string>`coalesce(sum(${expenses.amount}), 0)`,
      })
      .from(expenses);

    const [result] = await query.where(and(...conditions));
    return result?.total || '0.00';
  }
}
