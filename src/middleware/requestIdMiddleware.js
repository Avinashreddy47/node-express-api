import { randomUUID } from 'crypto';

/**
 * Request ID Middleware
 * Adds unique identifier to each request for tracking/debugging
 */
export const requestIdMiddleware = (req, res, next) => {
  req.id = req.headers['x-request-id'] || randomUUID();
  res.setHeader('x-request-id', req.id);
  next();
};
