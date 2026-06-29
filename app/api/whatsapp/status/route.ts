import { NextResponse } from 'next/server';
import QRCode from 'qrcode';
import { auth } from '@clerk/nextjs/server';
import { SettingsRepository } from '@/repositories/settings';
import { logger } from '@/utils/logger';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let status = 'disconnected';
    let qr: string | null = null;
    let jid: string | null = null;

    try {
      const botRes = await fetch('http://localhost:3005/status');
      if (botRes.ok) {
        const data = await botRes.json();
        status = data.status;
        qr = data.qr;
        jid = data.jid;
      }
    } catch (err) {
      status = 'disconnected';
    }

    // Auto-link the connected JID to the user's database settings if they scanned a QR code
    if (status === 'connected' && jid) {
      try {
        const settingsRepo = new SettingsRepository();
        const currentSettings = await settingsRepo.getSettings(userId);
        if (!currentSettings.whatsappJid || currentSettings.whatsappJid !== jid) {
          await settingsRepo.updateSettings(userId, {
            whatsappJid: jid
          });
          logger.info(`Automatically linked WhatsApp JID ${jid} to user ${userId} via status check.`);
        }
      } catch (dbErr) {
        logger.error(dbErr, 'Failed to auto-link JID in status check');
      }
    }

    let qrCodeDataUrl: string | null = null;

    if (qr) {
      try {
        qrCodeDataUrl = await QRCode.toDataURL(qr);
      } catch (error) {
        console.error('Error generating WhatsApp QR code data URL:', error);
      }
    }

    const connectedNumber = jid ? jid.split('@')[0] : null;

    return NextResponse.json({
      status,
      qrCode: qrCodeDataUrl,
      connectedNumber,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
