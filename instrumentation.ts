export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { whatsappService } = await import('./services/whatsapp');
    const { SchedulerService } = await import('./services/scheduler');
    
    // Initialize the WhatsApp service asynchronously on server boot
    whatsappService.initialize().catch((err) => {
      console.error('Failed to initialize WhatsApp client at server startup:', err);
    });

    // Start the daily summary scheduler service
    try {
      SchedulerService.start();
    } catch (err) {
      console.error('Failed to start SchedulerService at server startup:', err);
    }
  }
}
