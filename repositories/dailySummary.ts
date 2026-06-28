import { db } from '@/lib/db/client';
import { dailySummaries } from '@/lib/db/schema';
import { type DailySummary, type NewDailySummary } from '@/types/db';
import { eq, desc } from 'drizzle-orm';

export class DailySummaryRepository {
  /**
   * Create a new daily summary record
   */
  async create(data: NewDailySummary): Promise<DailySummary> {
    const [summary] = await db.insert(dailySummaries).values(data).returning();
    return summary;
  }

  /**
   * Find a summary by its specific date string (format: YYYY-MM-DD)
   */
  async findByDate(dateStr: string): Promise<DailySummary | undefined> {
    const [summary] = await db
      .select()
      .from(dailySummaries)
      .where(eq(dailySummaries.date, dateStr))
      .limit(1);
    return summary;
  }

  /**
   * Fetch all daily summaries, ordered newest first
   */
  async findAll(limitVal = 100): Promise<DailySummary[]> {
    return db
      .select()
      .from(dailySummaries)
      .orderBy(desc(dailySummaries.date))
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
