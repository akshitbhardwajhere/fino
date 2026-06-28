import { NextResponse } from 'next/server';
import { whatsappService } from '@/services/whatsapp';
import { auth } from '@clerk/nextjs/server';

export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await whatsappService.resetSession();
    return NextResponse.json({ success: true, message: 'WhatsApp session reset successfully' });
  } catch (error: any) {
    console.error('Error resetting WhatsApp session:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to reset WhatsApp session' },
      { status: 500 }
    );
  }
}
