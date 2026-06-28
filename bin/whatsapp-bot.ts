import http from 'http';
import { whatsappService } from '../services/whatsapp';
import { SchedulerService } from '../services/scheduler';
import { logger } from '../utils/logger';

async function startBot() {
  logger.info('WhatsApp Bot Process starting...');

  // Initialize WhatsApp connection
  try {
    await whatsappService.initialize();
  } catch (err) {
    logger.error(err, 'Failed to initialize WhatsApp service in bot process');
  }

  // Start daily summaries scheduler
  try {
    SchedulerService.start();
  } catch (err) {
    logger.error(err, 'Failed to start SchedulerService in bot process');
  }

  // Start HTTP control server on port 3005
  const server = http.createServer(async (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    if (req.url === '/status' && req.method === 'GET') {
      const statusData = whatsappService.getStatus();
      res.writeHead(200);
      res.end(JSON.stringify(statusData));
    } else if (req.url === '/reset' && req.method === 'POST') {
      try {
        await whatsappService.resetSession();
        res.writeHead(200);
        res.end(JSON.stringify({ success: true }));
      } catch (err: any) {
        res.writeHead(500);
        res.end(JSON.stringify({ success: false, error: err.message }));
      }
    } else {
      res.writeHead(404);
      res.end(JSON.stringify({ error: 'Not Found' }));
    }
  });

  const PORT = 3005;
  server.listen(PORT, () => {
    logger.info(`WhatsApp Bot HTTP Server running on port ${PORT}`);
  });
}

startBot().catch((err) => {
  logger.error(err, 'Fatal error in WhatsApp Bot Process');
  process.exit(1);
});
