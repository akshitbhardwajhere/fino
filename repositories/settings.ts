import { db } from '@/lib/db/client';
import { settings } from '@/lib/db/schema';
import { type Settings, type NewSettings } from '@/types/db';
import { eq, like, and, ne } from 'drizzle-orm';

export class SettingsRepository {
  /**
   * Retrieves preferences for a specific user.
   * If no settings exist for the user, inserts default config and returns it.
   */
  async getSettings(userId: string): Promise<Settings> {
    const [existing] = await db
      .select()
      .from(settings)
      .where(eq(settings.id, userId))
      .limit(1);

    if (existing) {
      return existing;
    }

    // Initialize defaults if table is empty for this user
    const defaultSettings: NewSettings = {
      id: userId,
      aiProvider: 'groq',
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
   * Updates settings row with new preferences for a specific user.
   * Inserts the record if it does not exist.
   */
  async updateSettings(userId: string, data: Partial<NewSettings>): Promise<Settings> {
    if (data.whatsappJid) {
      // Unlink this whatsappJid from other users to ensure uniqueness
      const cleanJid = data.whatsappJid.split('@')[0];
      await db
        .update(settings)
        .set({ whatsappJid: null, updatedAt: new Date() })
        .where(
          and(
            like(settings.whatsappJid, `${cleanJid}%`),
            ne(settings.id, userId)
          )
        );
    }

    const [existing] = await db
      .select()
      .from(settings)
      .where(eq(settings.id, userId))
      .limit(1);

    if (!existing) {
      const defaultSettings: NewSettings = {
        id: userId,
        aiProvider: data.aiProvider || 'groq',
        timezone: data.timezone || 'Asia/Kolkata',
        currency: data.currency || 'INR (₹)',
        summaryTime: data.summaryTime || '23:00',
        whatsappJid: data.whatsappJid,
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
      .where(eq(settings.id, userId))
      .returning();

    return updated;
  }

  /**
   * Retrieve settings by WhatsApp JID link.
   */
  async getSettingsByWhatsappJid(whatsappJid: string): Promise<Settings | null> {
    const cleanJid = whatsappJid.split('@')[0];
    const [existing] = await db
      .select()
      .from(settings)
      .where(like(settings.whatsappJid, `${cleanJid}@%`))
      .limit(1);

    return existing || null;
  }

  /**
   * Retrieve all settings in the system (for the scheduler).
   */
  async getAllSettings(): Promise<Settings[]> {
    return db.select().from(settings);
  }
}
