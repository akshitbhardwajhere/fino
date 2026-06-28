import { NextResponse } from 'next/server';
import { SettingsRepository } from '@/repositories/settings';
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
    const currentSettings = await settingsRepo.getSettings(userId);
    return NextResponse.json(currentSettings);
  } catch (error) {
    logger.error(error, 'Failed to fetch settings');
    return NextResponse.json({ error: 'Failed to retrieve settings' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { aiProvider, timezone, currency, summaryTime, phoneNumber } = body;

    const whatsappJid = phoneNumber ? phoneNumber.replace(/\D/g, '') + '@s.whatsapp.net' : null;

    const settingsRepo = new SettingsRepository();
    const updatedSettings = await settingsRepo.updateSettings(userId, {
      aiProvider,
      timezone,
      currency,
      summaryTime,
      whatsappJid,
    });

    return NextResponse.json(updatedSettings);
  } catch (error) {
    logger.error(error, 'Failed to update settings');
    return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 });
  }
}
