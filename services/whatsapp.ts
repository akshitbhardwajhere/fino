/* eslint-disable react-hooks/rules-of-hooks */
import makeWASocket, {
  DisconnectReason,
  useMultiFileAuthState,
  type WASocket,
} from '@whiskeysockets/baileys';
import { Boom } from '@hapi/boom';
import pino from 'pino';
import { logger } from '@/utils/logger';
import { MessageLogRepository } from '@/repositories/messageLog';
import { ExpenseRepository } from '@/repositories/expense';
import { GroqService } from '@/services/groq';

declare global {
  var whatsappService: WhatsAppService | undefined;
}

export class WhatsAppService {
  private sock: WASocket | null = null;
  private status: 'disconnected' | 'connecting' | 'connected' = 'disconnected';
  private qrCode: string | null = null;
  private sentMessageIds = new Set<string>();

  constructor() {}

  /**
   * Returns current connection status and the QR code if available
   */
  public getStatus() {
    return {
      status: this.status,
      qr: this.qrCode,
    };
  }

  /**
   * Initializes Baileys WhatsApp client and registers event hooks
   */
  public async initialize() {
    if (this.sock) {
      logger.info('WhatsApp client instance already active.');
      return;
    }

    const sessionPath = process.env.WHATSAPP_SESSION_PATH || './.wwebjs_auth';
    
    logger.info(`Starting WhatsApp connection with session path: ${sessionPath}`);
    this.status = 'connecting';

    try {
      const { state, saveCreds } = await useMultiFileAuthState(sessionPath);

      const sock = makeWASocket({
        auth: state,
        printQRInTerminal: true,
        // Disable verbose debug logs from Baileys
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        logger: pino({ level: 'warn' }) as any,
      });

      this.sock = sock;

      // Save credentials when updated
      sock.ev.on('creds.update', saveCreds);

      // Monitor connection state
      sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect, qr } = update;

        if (qr) {
          this.qrCode = qr;
          this.status = 'connecting';
          logger.info('New WhatsApp connection QR Code generated.');
        }

        if (connection === 'close') {
          this.qrCode = null;
          this.status = 'disconnected';
          this.sock = null;

          const statusCode = (lastDisconnect?.error as Boom)?.output?.statusCode;
          const shouldReconnect = statusCode !== DisconnectReason.loggedOut;

          logger.warn(
            `WhatsApp socket closed. Error code: ${statusCode}. Reconnecting: ${shouldReconnect}`
          );

          if (shouldReconnect) {
            // Reconnect after 5 seconds delay
            setTimeout(() => this.initialize(), 5000);
          }
        } else if (connection === 'open') {
          logger.info('WhatsApp connection successfully established.');
          this.status = 'connected';
          this.qrCode = null;
        }
      });

      // Instantiate repositories for message handling
      const messageLogRepo = new MessageLogRepository();
      const expenseRepo = new ExpenseRepository();

      // Handle incoming messages
      sock.ev.on('messages.upsert', async (m) => {
        if (m.type !== 'notify') return;

        for (const msg of m.messages) {
          const messageId = msg.key.id;
          if (messageId && this.sentMessageIds.has(messageId)) {
            continue; // Skip messages sent by the bot itself
          }

          // Extract text from standard message types
          const text =
            msg.message?.conversation ||
            msg.message?.extendedTextMessage?.text ||
            '';

          if (!text) continue;

          const remoteJid = msg.key.remoteJid;
          if (!remoteJid) continue;

          logger.info(`WhatsApp message received from ${remoteJid}: "${text}"`);

          // Create message log in the database
          let logRecord;
          try {
            logRecord = await messageLogRepo.create({
              incomingMessage: text,
              status: 'pending',
            });
          } catch (dbErr) {
            logger.error(dbErr, 'Failed to create message log entry');
          }

          try {
            // Call Groq parser service to analyze message intent and content
            const parsed = await GroqService.parseMessage(text);

            if (parsed.intent === 'track_expense' && parsed.expense) {
              // Create the expense record
              await expenseRepo.create({
                amount: parsed.expense.amount.toString(),
                category: parsed.expense.category,
                description: parsed.expense.description,
              });

              // Resolve message log in database
              if (logRecord) {
                await messageLogRepo.updateResolution(logRecord.id, {
                  status: 'processed',
                  intent: 'track_expense',
                  response: parsed.reply,
                  // cast to keep eslint happy with JSON JSONB compatibilities
                  parsedJson: parsed as unknown as Record<string, unknown>,
                });
              }

              // Send confirmation response to user
              await this.sendMessage(remoteJid, parsed.reply);
            } else {
              // Resolve message log as general intent
              if (logRecord) {
                await messageLogRepo.updateResolution(logRecord.id, {
                  status: 'processed',
                  intent: parsed.intent || 'other',
                  response: parsed.reply,
                  parsedJson: parsed as unknown as Record<string, unknown>,
                });
              }

              // Send helper/greeting reply to user
              await this.sendMessage(remoteJid, parsed.reply);
            }
          } catch (err) {
            logger.error(err, `Failed to process message: "${text}"`);
            
            if (logRecord) {
              await messageLogRepo.updateResolution(logRecord.id, {
                status: 'failed',
                response: 'Internal processing error',
              });
            }

            try {
              const errMsg = '🤖 *Fino Assistant Error*\n\nSorry, I encountered an internal error processing your message. Please check the logs.';
              await this.sendMessage(remoteJid, errMsg);
            } catch (sendErr) {
              logger.error(sendErr, 'Failed to send processing error notification');
            }
          }
        }
      });

    } catch (error) {
      logger.error(error, 'Error during WhatsApp initialization');
      this.status = 'disconnected';
      this.sock = null;
    }
  }

  /**
   * Sends a message to a WhatsApp JID
   */
  public async sendMessage(to: string, text: string) {
    if (!this.sock || this.status !== 'connected') {
      logger.warn('Attempted to send message while WhatsApp is not connected.');
      throw new Error('WhatsApp client is not connected.');
    }

    const sentMsg = await this.sock.sendMessage(to, { text });
    if (sentMsg?.key?.id) {
      this.sentMessageIds.add(sentMsg.key.id);
    }
    return sentMsg;
  }

  /**
   * Retrieves the connected user's bare JID (e.g. phone_number@s.whatsapp.net)
   */
  public getConnectedJid(): string | null {
    if (!this.sock || this.status !== 'connected') {
      return null;
    }
    const myJid = this.sock.user?.id;
    if (!myJid) return null;
    return myJid.split(':')[0] + '@s.whatsapp.net';
  }
}

// Singleton pattern with globalThis check to prevent multiple instances during dev reloading
export const whatsappService = globalThis.whatsappService || new WhatsAppService();

if (process.env.NODE_ENV !== 'production') {
  globalThis.whatsappService = whatsappService;
}
