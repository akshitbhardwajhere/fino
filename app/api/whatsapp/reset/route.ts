import { NextResponse } from 'next/server';
import { whatsappService } from '@/services/whatsapp';

export const dynamic = 'force-dynamic';

export async function POST() {
  try {
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
