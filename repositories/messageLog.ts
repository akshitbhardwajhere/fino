import { db } from '@/lib/db/client';
import { messageLogs } from '@/lib/db/schema';
import { type MessageLog, type NewMessageLog } from '@/types/db';
import { eq, desc } from 'drizzle-orm';

export class MessageLogRepository {
  /**
   * Log a new incoming message from WhatsApp
   */
  async create(data: NewMessageLog): Promise<MessageLog> {
    const [log] = await db.insert(messageLogs).values(data).returning();
    return log;
  }

  /**
   * Retrieve a message log by UUID
   */
  async findById(id: string): Promise<MessageLog | undefined> {
    const [log] = await db.select().from(messageLogs).where(eq(messageLogs.id, id)).limit(1);
    return log;
  }

  /**
   * Fetch all message logs ordered by creation time (newest first)
   */
  async findAll(userId?: string, limitVal = 100): Promise<MessageLog[]> {
    const query = db.select().from(messageLogs);
    if (userId) {
      return query
        .where(eq(messageLogs.userId, userId))
        .orderBy(desc(messageLogs.createdAt))
        .limit(limitVal);
    }
    return query
      .orderBy(desc(messageLogs.createdAt))
      .limit(limitVal);
  }

  /**
   * Update message log parsing outcome and status
   */
  async updateResolution(
    id: string,
    updates: {
      status: 'pending' | 'processed' | 'failed';
      response?: string;
      parsedJson?: Record<string, unknown>;
      intent?: string;
    }
  ): Promise<MessageLog | undefined> {
    const [updated] = await db
      .update(messageLogs)
      .set({
        status: updates.status,
        response: updates.response || null,
        parsedJson: updates.parsedJson || null,
        intent: updates.intent || null,
      })
      .where(eq(messageLogs.id, id))
      .returning();
    return updated;
  }
}
