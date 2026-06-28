import { NextResponse } from 'next/server';
import QRCode from 'qrcode';
import { auth } from '@clerk/nextjs/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let status = 'disconnected';
    let qr: string | null = null;

    try {
      const botRes = await fetch('http://localhost:3005/status');
      if (botRes.ok) {
        const data = await botRes.json();
        status = data.status;
        qr = data.qr;
      }
    } catch (err) {
      // Bot is not running or unreachable
      status = 'disconnected';
    }

    let qrCodeDataUrl: string | null = null;

    if (qr) {
      try {
        // Convert raw QR string to a base64 PNG data URL
        qrCodeDataUrl = await QRCode.toDataURL(qr);
      } catch (error) {
        console.error('Error generating WhatsApp QR code data URL:', error);
      }
    }

    return NextResponse.json({
      status,
      qrCode: qrCodeDataUrl,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
