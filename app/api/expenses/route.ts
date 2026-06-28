import { NextResponse } from 'next/server';
import { ExpenseRepository } from '@/repositories/expense';
import { SettingsRepository } from '@/repositories/settings';
import { logger } from '@/utils/logger';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || undefined;
    const category = searchParams.get('category') || undefined;

    const expenseRepo = new ExpenseRepository();
    const settingsRepo = new SettingsRepository();

    const expenses = await expenseRepo.findAll({
      search,
      category,
    });

    const settings = await settingsRepo.getSettings();

    return NextResponse.json({
      expenses,
      currency: settings.currency,
    });
  } catch (error) {
    logger.error(error, 'Failed to fetch expenses');
    return NextResponse.json({ error: 'Failed to retrieve expenses' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing expense ID' }, { status: 400 });
    }

    const expenseRepo = new ExpenseRepository();
    const deleted = await expenseRepo.delete(id);

    return NextResponse.json({ success: deleted });
  } catch (error) {
    logger.error(error, 'Failed to delete expense');
    return NextResponse.json({ error: 'Failed to delete expense' }, { status: 500 });
  }
}
