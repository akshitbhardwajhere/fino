import { NextResponse } from 'next/server';
import { SettingsRepository } from '@/repositories/settings';
import { db } from '@/lib/db/client';
import { expenses } from '@/lib/db/schema';
import { sql, gte, eq, and } from 'drizzle-orm';
import { logger } from '@/utils/logger';
import { auth } from '@clerk/nextjs/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const settingsRepo = new SettingsRepository();
    const settings = await settingsRepo.getSettings(userId);
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
      .where(
        and(
          eq(expenses.userId, userId),
          gte(expenses.spentAt, sevenDaysAgo)
        )
      )
      .groupBy(sql`(${expenses.spentAt} AT TIME ZONE ${timezone})::date::text`)
      .orderBy(sql`(${expenses.spentAt} AT TIME ZONE ${timezone})::date::text`);

    // 2. Get category totals
    const categoryDistribution = await db
      .select({
        category: expenses.category,
        total: sql<string>`coalesce(sum(${expenses.amount}), 0)`,
      })
      .from(expenses)
      .where(eq(expenses.userId, userId))
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
