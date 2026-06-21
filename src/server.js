import app from './app.js';
import config from './config/index.js';

const server = app.listen(config.port, () => {
  console.log(`
╔════════════════════════════════════════════════╗
║         Node.js Express API Server              ║
╠════════════════════════════════════════════════╣
║ Environment: ${config.environment.padEnd(36)} ║
║ Port:        ${config.port.toString().padEnd(36)} ║
║ Version:     ${config.api.version.padEnd(36)} ║
╚════════════════════════════════════════════════╝
  `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});

export default server;
