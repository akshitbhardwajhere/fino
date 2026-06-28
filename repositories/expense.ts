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
   * Retrieve an expense by its unique UUID
   */
  async findById(id: string): Promise<Expense | undefined> {
    const [expense] = await db.select().from(expenses).where(eq(expenses.id, id)).limit(1);
    return expense;
  }

  /**
   * Find all expenses with optional filtering (category, date range, description search)
   */
  async findAll(filters?: {
    category?: string;
    startDate?: Date;
    endDate?: Date;
    search?: string;
  }): Promise<Expense[]> {
    const conditions = [];

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
  async update(id: string, data: Partial<NewExpense>): Promise<Expense | undefined> {
    const [updated] = await db
      .update(expenses)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(expenses.id, id))
      .returning();
    return updated;
  }

  /**
   * Delete an expense by UUID
   */
  async delete(id: string): Promise<boolean> {
    const result = await db.delete(expenses).where(eq(expenses.id, id)).returning();
    return result.length > 0;
  }

  /**
   * Get total spending grouped by categories in a specific date range
   */
  async getTotalsGroupedByCategory(
    startDate?: Date,
    endDate?: Date
  ): Promise<{ category: string; total: string }[]> {
    const conditions = [];

    if (startDate) {
      conditions.push(gte(expenses.spentAt, startDate));
    }

    if (endDate) {
      conditions.push(lte(expenses.spentAt, endDate));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const query = db
      .select({
        category: expenses.category,
        total: sql<string>`sum(${expenses.amount})`,
      })
      .from(expenses)
      .groupBy(expenses.category);

    if (whereClause) {
      return query.where(whereClause);
    }

    return query;
  }

  /**
   * Get total spending sum in a specific date range
   */
  async getTotalSpending(startDate?: Date, endDate?: Date): Promise<string> {
    const conditions = [];

    if (startDate) {
      conditions.push(gte(expenses.spentAt, startDate));
    }

    if (endDate) {
      conditions.push(lte(expenses.spentAt, endDate));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const query = db
      .select({
        total: sql<string>`coalesce(sum(${expenses.amount}), 0)`,
      })
      .from(expenses);

    const [result] = whereClause ? await query.where(whereClause) : await query;
    return result?.total || '0.00';
  }
}
