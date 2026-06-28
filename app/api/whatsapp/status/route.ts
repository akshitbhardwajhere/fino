import { NextResponse } from 'next/server';
import { whatsappService } from '@/services/whatsapp';
import QRCode from 'qrcode';

export const dynamic = 'force-dynamic';

export async function GET() {
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
}
