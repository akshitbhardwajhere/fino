import { NextResponse } from 'next/server';
import { MessageLogRepository } from '@/repositories/messageLog';
import { logger } from '@/utils/logger';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const messageLogRepo = new MessageLogRepository();
    const logs = await messageLogRepo.findAll();
    return NextResponse.json(logs);
  } catch (error) {
    logger.error(error, 'Failed to fetch message logs');
    return NextResponse.json({ error: 'Failed to retrieve logs' }, { status: 500 });
  }
}
