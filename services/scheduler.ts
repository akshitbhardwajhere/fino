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
    const settings = await settingsRepo.getSettings();
    const { timezone, summaryTime, currency } = settings;

    // Get current local time parts
    const now = new Date();
    
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
    
    const dateParts = dateFormatter.formatToParts(now);
    const year = dateParts.find(p => p.type === 'year')?.value;
    const month = dateParts.find(p => p.type === 'month')?.value;
    const day = dateParts.find(p => p.type === 'day')?.value;
    const dateStr = `${year}-${month}-${day}`;

    const dailySummaryRepo = new DailySummaryRepository();

    // Send any unsent daily summaries if WhatsApp is connected
    const targetJid = whatsappService.getConnectedJid();
    if (targetJid) {
      try {
        const allSummaries = await dailySummaryRepo.findAll(10);
        for (const summary of allSummaries) {
          if (!summary.sentAt) {
            logger.info(`Found unsent daily summary for date ${summary.date}. Attempting to send...`);
            try {
              await whatsappService.sendMessage(targetJid, summary.summary);
              await dailySummaryRepo.markAsSent(summary.id);
              logger.info(`Unsent daily summary for date ${summary.date} successfully sent.`);
            } catch (sendErr) {
              logger.error(sendErr, `Failed to send unsent daily summary for date ${summary.date}`);
              // Stop processing remaining summaries on connection failure
              break;
            }
          }
        }
      } catch (err) {
        logger.error(err, 'Error processing unsent daily summaries');
      }
    }

    // Check if scheduled time matches for creating a new daily summary
    if (timeStr !== summaryTime) {
      return;
    }

    // Check if daily summary already exists for this date
    const existingSummary = await dailySummaryRepo.findByDate(dateStr);

    if (existingSummary) {
      // Already run for today
      return;
    }

    logger.info(`Summary due for date ${dateStr} at local time ${timeStr} in timezone ${timezone}`);

    // Compute start and end of that day in the local timezone
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

    // Fetch expenses for today
    const expenseRepo = new ExpenseRepository();
    const todayExpenses = await expenseRepo.findAll({
      startDate,
      endDate,
    });

    logger.info(`Found ${todayExpenses.length} expenses for ${dateStr} between ${startDate.toISOString()} and ${endDate.toISOString()}`);

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
      date: dateStr,
      total: totalAmountStr,
      summary: summaryText,
    });

    // Send summary via WhatsApp to connected user
    const summaryJid = whatsappService.getConnectedJid();
    if (!summaryJid) {
      logger.warn('Could not broadcast daily summary: WhatsApp client not connected or user JID not available.');
      return;
    }

    try {
      await whatsappService.sendMessage(summaryJid, summaryText);
      await dailySummaryRepo.markAsSent(newSummary.id);
      logger.info(`Daily summary successfully sent to ${summaryJid} and saved in DB.`);
    } catch (sendErr) {
      logger.error(sendErr, `Failed to send daily summary to WhatsApp JID: ${summaryJid}`);
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
