import { NextResponse } from 'next/server';
import { SettingsRepository } from '@/repositories/settings';
import { db } from '@/lib/db/client';
import { expenses } from '@/lib/db/schema';
import { sql } from 'drizzle-orm';
import { logger } from '@/utils/logger';

export const dynamic = 'force-dynamic';

const CATEGORIES_INFO = [
  { name: 'Food', desc: 'Meals, restaurants, groceries, coffee, and snacks' },
  { name: 'Transport', desc: 'Fuel, public transit, taxi, tolls, and vehicle running costs' },
  { name: 'Utilities', desc: 'Rent, electricity, water, internet, phone bills, and subscriptions' },
  { name: 'Travel', desc: 'Flights, hotels, vacation packages, and sightseeing' },
  { name: 'Entertainment', desc: 'Movies, concerts, gaming, and hobby activities' },
  { name: 'Other', desc: 'Miscellaneous expenses that do not fit standard categories' },
];

export async function GET() {
  try {
    const settingsRepo = new SettingsRepository();
    const settings = await settingsRepo.getSettings();

    // Query counts and sums grouped by category from DB
    const results = await db
      .select({
        category: expenses.category,
        count: sql<number>`count(*)::int`,
        total: sql<string>`coalesce(sum(${expenses.amount}), 0)`,
      })
      .from(expenses)
      .groupBy(expenses.category);

    const categoriesData = CATEGORIES_INFO.map(cat => {
      const match = results.find(r => r.category.toLowerCase() === cat.name.toLowerCase());
      return {
        name: cat.name,
        desc: cat.desc,
        count: match ? match.count : 0,
        total: match ? parseFloat(match.total).toFixed(2) : '0.00',
      };
    });

    return NextResponse.json({
      categories: categoriesData,
      currency: settings.currency,
    });
  } catch (error) {
    logger.error(error, 'Failed to fetch categories stats');
    return NextResponse.json({ error: 'Failed to retrieve categories' }, { status: 500 });
  }
}
