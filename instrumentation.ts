export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { whatsappService } = await import('./services/whatsapp');
    
    // Initialize the WhatsApp service asynchronously on server boot
    whatsappService.initialize().catch((err) => {
      console.error('Failed to initialize WhatsApp client at server startup:', err);
    });
  }
}
