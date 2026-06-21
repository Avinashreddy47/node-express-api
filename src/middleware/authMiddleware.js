import { verifyToken, extractTokenFromHeader } from '../utils/jwtUtils.js';
import { errorResponse } from '../utils/response.js';

/**
 * JWT Authentication Middleware
 * Verifies Authorization header and attaches user to request
 */
export const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = extractTokenFromHeader(authHeader);

    if (!token) {
      return res.status(401).json(
        errorResponse('Missing or invalid Authorization header', 401)
      );
    }

    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json(
      errorResponse(error.message || 'Authentication failed', 401)
    );
  }
};

/**
 * Optional Auth Middleware
 * Attempts to verify token but doesn't fail if missing
 */
export const optionalAuthMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = extractTokenFromHeader(authHeader);

    if (token) {
      const decoded = verifyToken(token);
      req.user = decoded;
    }
  } catch (error) {
    // Continue without user context
  }
  next();
};
