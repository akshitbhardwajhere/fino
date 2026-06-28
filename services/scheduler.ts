import cron, { ScheduledTask } from 'node-cron';
import { SettingsRepository } from '@/repositories/settings';
import { ExpenseRepository } from '@/repositories/expense';
import { DailySummaryRepository } from '@/repositories/dailySummary';
import { GroqService } from '@/services/groq';
import { whatsappService } from '@/services/whatsapp';
import { logger } from '@/utils/logger';

declare global {
  var schedulerCronJob: ScheduledTask | undefined;
}

export class SchedulerService {
  private static isRunning = false;

  /**
   * Starts the background scheduler that wakes up every minute to check if a summary is due.
   */
  public static start() {
    if (globalThis.schedulerCronJob) {
      logger.info('Scheduler already running.');
      return;
    }

    logger.info('Starting daily spending summary scheduler...');
    
    // Run every minute
    globalThis.schedulerCronJob = cron.schedule('* * * * *', async () => {
      if (this.isRunning) return;
      this.isRunning = true;

      try {
        await this.checkAndRunJobs();
      } catch (err) {
        logger.error(err, 'Error in scheduler checkAndRunJobs');
      } finally {
        this.isRunning = false;
      }
    });
  }

  /**
   * Helper logic to check if current timezone-adjusted time matches user preference
   * and triggers the daily summary compilation.
   */
  public static async checkAndRunJobs() {
    const settingsRepo = new SettingsRepository();
    const dailySummaryRepo = new DailySummaryRepository();
    const expenseRepo = new ExpenseRepository();

    // 1. Send any unsent daily summaries if WhatsApp is connected
    const targetJid = whatsappService.getConnectedJid();
    if (targetJid) {
      try {
        const allSummaries = await dailySummaryRepo.findAllUnsent(10);
        for (const summary of allSummaries) {
          if (summary.userId) {
            const userSettings = await settingsRepo.getSettings(summary.userId);
            if (userSettings && userSettings.whatsappJid) {
              logger.info(`Found unsent daily summary for user ${summary.userId} on date ${summary.date}. Attempting to send...`);
              try {
                await whatsappService.sendMessage(userSettings.whatsappJid, summary.summary);
                await dailySummaryRepo.markAsSent(summary.id);
                logger.info(`Unsent daily summary for user ${summary.userId} successfully sent.`);
              } catch (sendErr) {
                logger.error(sendErr, `Failed to send unsent daily summary for user ${summary.userId}`);
                // Stop processing remaining summaries on connection failure
                break;
              }
            }
          }
        }
      } catch (err) {
        logger.error(err, 'Error processing unsent daily summaries');
      }
    }

    // 2. Process daily summaries per user
    try {
      const allUserSettings = await settingsRepo.getAllSettings();
      const now = new Date();

      for (const userSettings of allUserSettings) {
        const userId = userSettings.id;
        const { timezone, summaryTime, currency, whatsappJid } = userSettings;

        // Skip users without a linked WhatsApp phone number
        if (!whatsappJid) {
          continue;
        }

        const timeFormatter = new Intl.DateTimeFormat('en-US', {
          timeZone: timezone,
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        });
        const dateFormatter = new Intl.DateTimeFormat('en-US', {
          timeZone: timezone,
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
        });

        const timeStr = timeFormatter.format(now); // e.g. "23:00"

        // Check if scheduled time matches for this user
        if (timeStr !== summaryTime) {
          continue;
        }

        const dateParts = dateFormatter.formatToParts(now);
        const year = dateParts.find(p => p.type === 'year')?.value;
        const month = dateParts.find(p => p.type === 'month')?.value;
        const day = dateParts.find(p => p.type === 'day')?.value;
        const dateStr = `${year}-${month}-${day}`;

        // Check if daily summary already exists for this date and user
        const existingSummary = await dailySummaryRepo.findByDateAndUser(dateStr, userId);
        if (existingSummary) {
          // Already run for today for this user
          continue;
        }

        logger.info(`Summary due for user ${userId} for date ${dateStr} at local time ${timeStr} in timezone ${timezone}`);

        // Compute start and end of that day in the user's timezone
        const localStartStr = `${year}-${month}-${day}T00:00:00`;
        const localEndStr = `${year}-${month}-${day}T23:59:59.999`;

        const getAbsoluteDate = (dateTimeStr: string, timeZone: string): Date => {
          const date = new Date(dateTimeStr + 'Z');
          const utcDate = new Date(date.toLocaleString('en-US', { timeZone: 'UTC' }));
          const tzDate = new Date(date.toLocaleString('en-US', { timeZone }));
          const diff = utcDate.getTime() - tzDate.getTime();
          return new Date(date.getTime() + diff);
        };

        const startDate = getAbsoluteDate(localStartStr, timezone);
        const endDate = getAbsoluteDate(localEndStr, timezone);

        // Fetch expenses for today for this user
        const todayExpenses = await expenseRepo.findAll({
          userId,
          startDate,
          endDate,
        });

        logger.info(`Found ${todayExpenses.length} expenses for user ${userId} on ${dateStr}`);

        const totalAmountStr = todayExpenses
          .reduce((sum, exp) => sum + parseFloat(exp.amount), 0)
          .toFixed(2);

        // Generate daily summary text using GroqService
        const summaryText = await GroqService.generateDailySummary(
          todayExpenses,
          currency
        );

        // Save summary in database
        const newSummary = await dailySummaryRepo.create({
          userId,
          date: dateStr,
          total: totalAmountStr,
          summary: summaryText,
        });

        // Send summary via WhatsApp to user's JID
        if (targetJid) {
          try {
            await whatsappService.sendMessage(whatsappJid, summaryText);
            await dailySummaryRepo.markAsSent(newSummary.id);
            logger.info(`Daily summary successfully sent to ${whatsappJid} for user ${userId}.`);
          } catch (sendErr) {
            logger.error(sendErr, `Failed to send daily summary to WhatsApp JID: ${whatsappJid} for user ${userId}`);
          }
        }
      }
    } catch (err) {
      logger.error(err, 'Error running daily summary jobs');
    }
  }

  /**
   * Stops the active cron job.
   */
  public static stop() {
    if (globalThis.schedulerCronJob) {
      globalThis.schedulerCronJob.stop();
      globalThis.schedulerCronJob = undefined;
      logger.info('Scheduler stopped.');
    }
  }
}
