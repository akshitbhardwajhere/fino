import { db } from '@/lib/db/client';
import { settings } from '@/lib/db/schema';
import { type Settings, type NewSettings } from '@/types/db';
import { eq } from 'drizzle-orm';

export class SettingsRepository {
  /**
   * Retrieves global configuration preferences.
   * If no settings exist in the database, inserts default config and returns it.
   */
  async getSettings(): Promise<Settings> {
    const [existing] = await db
      .select()
      .from(settings)
      .where(eq(settings.id, 'global'))
      .limit(1);

    if (existing) {
      return existing;
    }

    // Initialize defaults if table is empty
    const defaultSettings: NewSettings = {
      id: 'global',
      aiProvider: 'gemini',
      timezone: 'Asia/Kolkata',
      currency: 'INR (₹)',
      summaryTime: '23:00',
    };

    const [inserted] = await db
      .insert(settings)
      .values(defaultSettings)
      .returning();

    return inserted;
  }

  /**
   * Updates settings row with new preferences.
   * Inserts the record if it does not exist.
   */
  async updateSettings(data: Partial<NewSettings>): Promise<Settings> {
    const [existing] = await db
      .select()
      .from(settings)
      .where(eq(settings.id, 'global'))
      .limit(1);

    if (!existing) {
      const defaultSettings: NewSettings = {
        id: 'global',
        aiProvider: data.aiProvider || 'gemini',
        timezone: data.timezone || 'Asia/Kolkata',
        currency: data.currency || 'INR (₹)',
        summaryTime: data.summaryTime || '23:00',
      };
      const [inserted] = await db
        .insert(settings)
        .values(defaultSettings)
        .returning();
      return inserted;
    }

    const [updated] = await db
      .update(settings)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(settings.id, 'global'))
      .returning();

    return updated;
  }
}
