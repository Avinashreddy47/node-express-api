import config from '../config/index.js';
import { errorResponse } from '../utils/response.js';

/**
 * Global Error Handler Middleware
 * Catches all errors and returns consistent error response envelope
 */
export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';
  
  // Log error details in development
  if (config.isDevelopment) {
    console.error('Error:', {
      message: err.message,
      stack: err.stack,
      statusCode
    });
  }

  return res.status(statusCode).json(
    errorResponse(message, statusCode, err.errors || null)
  );
};

/**
 * 404 Not Found Middleware
 */
export const notFoundHandler = (req, res) => {
  return res.status(404).json(
    errorResponse(`Route ${req.method} ${req.originalUrl} not found`, 404)
  );
};

/**
 * Custom Error Class
 */
export class ApiError extends Error {
  constructor(message, statusCode = 500, errors = null) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    Error.captureStackTrace(this, this.constructor);
  }
}
