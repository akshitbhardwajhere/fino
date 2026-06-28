import { db } from '@/lib/db/client';
import { dailySummaries } from '@/lib/db/schema';
import { type DailySummary, type NewDailySummary } from '@/types/db';
import { eq, desc, and, isNull } from 'drizzle-orm';

export class DailySummaryRepository {
  /**
   * Create a new daily summary record
   */
  async create(data: NewDailySummary): Promise<DailySummary> {
    const [summary] = await db.insert(dailySummaries).values(data).returning();
    return summary;
  }

  /**
   * Find a summary by its specific date string and user ID
   */
  async findByDateAndUser(dateStr: string, userId: string): Promise<DailySummary | undefined> {
    const [summary] = await db
      .select()
      .from(dailySummaries)
      .where(and(eq(dailySummaries.date, dateStr), eq(dailySummaries.userId, userId)))
      .limit(1);
    return summary;
  }

  /**
   * Fetch all daily summaries for a user, ordered newest first
   */
  async findAll(userId: string, limitVal = 100): Promise<DailySummary[]> {
    return db
      .select()
      .from(dailySummaries)
      .where(eq(dailySummaries.userId, userId))
      .orderBy(desc(dailySummaries.date))
      .limit(limitVal);
  }

  /**
   * Fetch all unsent summaries in the system (for connection-loss retry logic)
   */
  async findAllUnsent(limitVal = 100): Promise<DailySummary[]> {
    return db
      .select()
      .from(dailySummaries)
      .where(isNull(dailySummaries.sentAt))
      .limit(limitVal);
  }

  /**
   * Mark summary as sent
   */
  async markAsSent(id: string, sentAtTime: Date = new Date()): Promise<DailySummary | undefined> {
    const [updated] = await db
      .update(dailySummaries)
      .set({ sentAt: sentAtTime })
      .where(eq(dailySummaries.id, id))
      .returning();
    return updated;
  }
}
