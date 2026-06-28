import { NextResponse } from 'next/server';
import { whatsappService } from '@/services/whatsapp';
import QRCode from 'qrcode';
import { auth } from '@clerk/nextjs/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { status, qr } = whatsappService.getStatus();

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
