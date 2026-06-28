export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const net = await import('net');
    const { spawn } = await import('child_process');

    const isPortInUse = (port: number): Promise<boolean> => {
      return new Promise((resolve) => {
        const server = net.createServer()
          .once('error', (err: any) => {
            if (err.code === 'EADDRINUSE') {
              resolve(true);
            } else {
              resolve(false);
            }
          })
          .once('listening', () => {
            server.close();
            resolve(false);
          })
          .listen(port);
      });
    };

    const portInUse = await isPortInUse(3005);
    if (portInUse) {
      console.log('WhatsApp Bot Process is already running.');
      return;
    }

    console.log('Starting WhatsApp Bot Process...');
    const child = spawn('npx', ['tsx', './bin/whatsapp-bot.ts'], {
      env: process.env,
      stdio: 'inherit',
    });

    child.on('error', (err) => {
      console.error('Failed to start WhatsApp Bot Process:', err);
    });

    child.on('exit', (code) => {
      console.log(`WhatsApp Bot Process exited with code ${code}`);
    });
  }
}
