import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import config from './config/index.js';
import { requestLogger } from './middleware/requestLogger.js';
import { requestIdMiddleware } from './middleware/requestIdMiddleware.js';
import { globalLimiter, authLimiter } from './middleware/rateLimiter.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import { logger } from './utils/logger.js';
import userRoutes from './routes/userRoutes.js';

const app = express();

/**
 * Security & Validation
 */

// Validate required environment variables on startup
const requiredEnvVars = ['JWT_SECRET', 'NODE_ENV'];
const missingEnvVars = requiredEnvVars.filter((envVar) => !process.env[envVar]);
if (missingEnvVars.length > 0) {
  logger.error('Missing required environment variables', new Error('Env validation failed'), {
    missingVars: missingEnvVars,
  });
  process.exit(1);
}

/**
 * Middleware Chain
 * Applied in order: security -> logging -> validation -> parsing -> routes -> error handling
 */

// Security headers with Helmet
app.use(helmet());

// Request ID tracking (must be before logging)
app.use(requestIdMiddleware);

// Request logging (structured with request ID)
app.use(requestLogger);

// CORS middleware
app.use(cors());

// Global rate limiting (after request ID, before bodyparser)
app.use(globalLimiter);

// Body parser middleware with size limits to prevent large payload attacks
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

/**
 * Routes
 */

// Health check endpoint with detailed info
app.get('/health', (req, res) => {
  return res.json({
    status: 'ok',
    environment: config.environment,
    version: config.api.version,
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    requestId: req.id,
  });
});

// API v1 routes
app.use(`/api/${config.api.version}`, userRoutes);

/**
 * Error Handling
 * Applied after all routes
 */

// 404 handler
app.use(notFoundHandler);

// Global error handler (must be last)
app.use(errorHandler);

export { app, authLimiter };
