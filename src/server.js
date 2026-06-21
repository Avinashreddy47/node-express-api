import { app } from './app.js';
import config from './config/index.js';
import { logger } from './utils/logger.js';

const server = app.listen(config.port, () => {
  logger.info('Server started successfully', {
    port: config.port,
    environment: config.environment,
    version: config.api.version,
  });

  console.log(`
╔════════════════════════════════════════════════╗
║         Node.js Express API Server              ║
╠════════════════════════════════════════════════╣
║ Environment: ${config.environment.padEnd(36)} ║
║ Port:        ${config.port.toString().padEnd(36)} ║
║ Version:     ${config.api.version.padEnd(36)} ║
║ Security:    Helmet + Rate Limiting + XSS      ║
╚════════════════════════════════════════════════╝
  `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    logger.info('HTTP server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  logger.info('SIGINT signal received: closing HTTP server');
  server.close(() => {
    logger.info('HTTP server closed');
    process.exit(0);
  });
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at', new Error('Unhandled Rejection'), {
    reason,
    promise,
  });
});

export default server;
