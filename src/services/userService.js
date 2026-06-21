import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';
import { ApiError } from '../middleware/errorHandler.js';
import { QueryBuilder } from '../utils/queryBuilder.js';
import { logger } from '../utils/logger.js';

/**
 * In-memory user store (would be database in production)
 */
let users = new Map();

// Password hashing configuration
const SALT_ROUNDS = 10;

/**
 * User Service Layer
 * Contains business logic for user operations
 */
export class UserService {
  /**
   * Create a new user with hashed password
   */
  static async createUser(userData) {
    const { email, username, password } = userData;

    // Check if user already exists
    if (Array.from(users.values()).some((u) => u.email === email || u.username === username)) {
      logger.warn('Duplicate user registration attempt', { email, username });
      throw new ApiError('User with this email or username already exists', 409);
    }

    // Hash password securely
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const user = {
      id: uuidv4(),
      email,
      username,
      password: hashedPassword, // Stored securely
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    users.set(user.id, user);
    logger.info('User created', { userId: user.id, username });
    return this._sanitizeUser(user);
  }

  /**
   * Get user by ID
   */
  static getUserById(userId) {
    const user = users.get(userId);
    if (!user) {
      logger.warn('User not found', { userId });
      throw new ApiError('User not found', 404);
    }
    return this._sanitizeUser(user);
  }

  /**
   * Get all users with advanced filtering, sorting, and pagination
   * Supports complex queries via QueryBuilder
   */
  static queryUsers(queryParams) {
    const allUsers = Array.from(users.values());

    // Create query builder from query parameters
    const queryBuilder = QueryBuilder.fromQuery(queryParams);

    // Execute query: filter -> sort -> paginate
    const result = queryBuilder.execute(allUsers);

    // Sanitize users before returning
    return {
      users: result.data.map((u) => this._sanitizeUser(u)),
      pagination: {
        page: result.page,
        limit: result.limit,
        total: result.total,
        pages: result.pages,
      },
    };
  }

  /**
   * Get all users with basic pagination (kept for backwards compatibility)
   */
  static getAllUsers(page = 1, limit = 10) {
    const allUsers = Array.from(users.values());
    const total = allUsers.length;
    const startIndex = (page - 1) * limit;
    const paginatedUsers = allUsers.slice(startIndex, startIndex + limit);

    return {
      users: paginatedUsers.map((u) => this._sanitizeUser(u)),
      total,
      page,
      limit,
    };
  }

  /**
   * Update user with optional password re-hashing
   */
  static async updateUser(userId, updateData) {
    const user = users.get(userId);
    if (!user) {
      logger.warn('Update failed - user not found', { userId });
      throw new ApiError('User not found', 404);
    }

    // If password is being updated, hash it
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, SALT_ROUNDS);
    }

    const updated = {
      ...user,
      ...updateData,
      updatedAt: new Date(),
    };

    users.set(userId, updated);
    logger.info('User updated', { userId });
    return this._sanitizeUser(updated);
  }

  /**
   * Delete user
   */
  static deleteUser(userId) {
    if (!users.has(userId)) {
      logger.warn('Delete failed - user not found', { userId });
      throw new ApiError('User not found', 404);
    }
    users.delete(userId);
    logger.info('User deleted', { userId });
    return true;
  }

  /**
   * Authenticate user with secure password comparison
   */
  static async authenticateUser(username, password) {
    const user = Array.from(users.values()).find((u) => u.username === username);

    if (!user) {
      logger.warn('Authentication failed - user not found', { username });
      throw new ApiError('Invalid credentials', 401);
    }

    // Use bcrypt to compare passwords securely
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      logger.warn('Authentication failed - invalid password', { username });
      throw new ApiError('Invalid credentials', 401);
    }

    logger.info('User authenticated', { userId: user.id, username });
    return this._sanitizeUser(user);
  }

  /**
   * Remove sensitive fields before returning user
   */
  static _sanitizeUser(user) {
    const { password, ...sanitized } = user;
    return sanitized;
  }
}
