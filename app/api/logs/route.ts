import { NextResponse } from 'next/server';
import { MessageLogRepository } from '@/repositories/messageLog';
import { logger } from '@/utils/logger';
import { auth } from '@clerk/nextjs/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const messageLogRepo = new MessageLogRepository();
    const logs = await messageLogRepo.findAll(userId);
    return NextResponse.json(logs);
  } catch (error) {
    logger.error(error, 'Failed to fetch message logs');
    return NextResponse.json({ error: 'Failed to retrieve logs' }, { status: 500 });
  }
}
