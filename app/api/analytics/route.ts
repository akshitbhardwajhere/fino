import { NextResponse } from 'next/server';
import { SettingsRepository } from '@/repositories/settings';
import { db } from '@/lib/db/client';
import { expenses } from '@/lib/db/schema';
import { sql, gte } from 'drizzle-orm';
import { logger } from '@/utils/logger';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const settingsRepo = new SettingsRepository();
    const settings = await settingsRepo.getSettings();
    const { timezone, currency } = settings;

    // 1. Get daily totals for the last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const dailySpending = await db
      .select({
        dateStr: sql<string>`(${expenses.spentAt} AT TIME ZONE ${timezone})::date::text`,
        total: sql<string>`coalesce(sum(${expenses.amount}), 0)`,
      })
      .from(expenses)
      .where(gte(expenses.spentAt, sevenDaysAgo))
      .groupBy(sql`(${expenses.spentAt} AT TIME ZONE ${timezone})::date::text`)
      .orderBy(sql`(${expenses.spentAt} AT TIME ZONE ${timezone})::date::text`);

    // 2. Get category totals
    const categoryDistribution = await db
      .select({
        category: expenses.category,
        total: sql<string>`coalesce(sum(${expenses.amount}), 0)`,
      })
      .from(expenses)
      .groupBy(expenses.category)
      .orderBy(sql`sum(${expenses.amount}) DESC`);

    return NextResponse.json({
      dailySpending,
      categoryDistribution,
      currency,
    });
  } catch (error) {
    logger.error(error, 'Failed to fetch analytics data');
    return NextResponse.json({ error: 'Failed to retrieve analytics' }, { status: 500 });
  }
}
