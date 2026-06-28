import { NextResponse } from 'next/server';
import { SettingsRepository } from '@/repositories/settings';
import { ExpenseRepository } from '@/repositories/expense';
import { db } from '@/lib/db/client';
import { messageLogs } from '@/lib/db/schema';
import { sql, eq } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const settingsRepo = new SettingsRepository();
    const expenseRepo = new ExpenseRepository();

    const settings = await settingsRepo.getSettings();
    const { timezone, currency, summaryTime } = settings;

    // Get dates in configured timezone
    const now = new Date();

    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
    const parts = formatter.formatToParts(now);
    const year = parts.find(p => p.type === 'year')?.value;
    const month = parts.find(p => p.type === 'month')?.value;
    const day = parts.find(p => p.type === 'day')?.value;

    const getAbsoluteDate = (dateTimeStr: string, timeZone: string): Date => {
      const date = new Date(dateTimeStr + 'Z');
      const utcDate = new Date(date.toLocaleString('en-US', { timeZone: 'UTC' }));
      const tzDate = new Date(date.toLocaleString('en-US', { timeZone }));
      const diff = utcDate.getTime() - tzDate.getTime();
      return new Date(date.getTime() + diff);
    };

    // Today's range
    const startOfToday = getAbsoluteDate(`${year}-${month}-${day}T00:00:00`, timezone);
    const endOfToday = getAbsoluteDate(`${year}-${month}-${day}T23:59:59.999`, timezone);

    // This Month's range
    const startOfMonth = getAbsoluteDate(`${year}-${month}-01T00:00:00`, timezone);
    // Find last day of month
    const lastDay = new Date(Number(year), Number(month), 0).getDate();
    const endOfMonth = getAbsoluteDate(`${year}-${month}-${String(lastDay).padStart(2, '0')}T23:59:59.999`, timezone);

    // 1. Today's spending
    const todayExpenses = await expenseRepo.findAll({ startDate: startOfToday, endDate: endOfToday });
    const todayTotal = todayExpenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0);

    // 2. This Month's spending
    const monthlySpending = await expenseRepo.getTotalSpending(startOfMonth, endOfMonth);
    const monthlyTotal = parseFloat(monthlySpending);

    // 3. Message log stats
    const [allLogsCountRes] = await db.select({ count: sql<number>`count(*)` }).from(messageLogs);
    const totalMessages = Number(allLogsCountRes?.count || 0);

    const [matchedLogsCountRes] = await db
      .select({ count: sql<number>`count(*)` })
      .from(messageLogs)
      .where(eq(messageLogs.intent, 'track_expense'));
    const matchedMessages = Number(matchedLogsCountRes?.count || 0);

    // 4. Recent expenses (limit 5)
    const recentExpenses = await expenseRepo.findAll();
    const topRecent = recentExpenses.slice(0, 5).map(exp => ({
      id: exp.id,
      amount: exp.amount,
      category: exp.category,
      description: exp.description || 'Unspecified',
      spentAt: exp.spentAt,
    }));

    // 5. Category breakdown for this month
    const categoryTotals = await expenseRepo.getTotalsGroupedByCategory(startOfMonth, endOfMonth);
    const totalCategorySum = categoryTotals.reduce((sum, item) => sum + parseFloat(item.total || '0'), 0);

    const colors = ['bg-indigo-500', 'bg-pink-500', 'bg-amber-500', 'bg-emerald-500', 'bg-sky-500', 'bg-violet-500'];
    const categoryBreakdown = categoryTotals.map((item, idx) => {
      const amount = parseFloat(item.total || '0');
      const percentage = totalCategorySum > 0 ? Math.round((amount / totalCategorySum) * 100) : 0;
      return {
        name: item.category,
        amount: amount.toFixed(2),
        percentage,
        color: colors[idx % colors.length],
      };
    }).sort((a, b) => parseFloat(b.amount) - parseFloat(a.amount));

    return NextResponse.json({
      timezone,
      currency,
      summaryTime,
      todayTotal: todayTotal.toFixed(2),
      todayCount: todayExpenses.length,
      monthlyTotal: monthlyTotal.toFixed(2),
      totalMessages,
      matchedMessages,
      recentExpenses: topRecent,
      categoryBreakdown,
    });
  } catch (error) {
    console.error('Failed to get dashboard stats:', error);
    return NextResponse.json({ error: 'Failed to retrieve stats' }, { status: 500 });
  }
}
