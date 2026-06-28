import { NextResponse } from 'next/server';
import { SettingsRepository } from '@/repositories/settings';
import { logger } from '@/utils/logger';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const settingsRepo = new SettingsRepository();
    const currentSettings = await settingsRepo.getSettings();
    return NextResponse.json(currentSettings);
  } catch (error) {
    logger.error(error, 'Failed to fetch settings');
    return NextResponse.json({ error: 'Failed to retrieve settings' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { aiProvider, timezone, currency, summaryTime } = body;

    const settingsRepo = new SettingsRepository();
    const updatedSettings = await settingsRepo.updateSettings({
      aiProvider,
      timezone,
      currency,
      summaryTime,
    });

    return NextResponse.json(updatedSettings);
  } catch (error) {
    logger.error(error, 'Failed to update settings');
    return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 });
  }
}
