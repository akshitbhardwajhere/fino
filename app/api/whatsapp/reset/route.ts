import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
      const botRes = await fetch('http://localhost:3005/reset', { method: 'POST' });
      if (!botRes.ok) {
        throw new Error('Failed to reset session in bot process');
      }
    } catch (err: any) {
      console.error('Error contacting WhatsApp bot process:', err);
      return NextResponse.json(
        { success: false, error: 'WhatsApp bot service is currently unreachable' },
        { status: 502 }
      );
    }

    return NextResponse.json({ success: true, message: 'WhatsApp session reset successfully' });
  } catch (error: any) {
    console.error('Error resetting WhatsApp session:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to reset WhatsApp session' },
      { status: 500 }
    );
  }
}
