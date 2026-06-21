import express from 'express';
import cors from 'cors';
import config from './config/index.js';
import { requestLogger } from './middleware/requestLogger.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import userRoutes from './routes/userRoutes.js';

const app = express();

/**
 * Middleware Chain
 * Applied in order: logging -> parsing -> CORS -> routes -> error handling
 */

// Request logging
app.use(requestLogger);

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS middleware
app.use(cors());

/**
 * Routes
 */
app.get('/health', (req, res) => {
  return res.json({
    status: 'ok',
    environment: config.environment,
    timestamp: new Date().toISOString()
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

export default app;
