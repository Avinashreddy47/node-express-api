import { v4 as uuidv4 } from 'uuid';
import { ApiError } from '../middleware/errorHandler.js';

/**
 * In-memory user store (would be database in production)
 */
let users = new Map();

/**
 * User Service Layer
 * Contains business logic for user operations
 */
export class UserService {
  /**
   * Create a new user
   */
  static createUser(userData) {
    const { email, username, password } = userData;

    // Check if user already exists
    if (Array.from(users.values()).some(u => u.email === email || u.username === username)) {
      throw new ApiError('User with this email or username already exists', 409);
    }

    const user = {
      id: uuidv4(),
      email,
      username,
      password, // In production: hash with bcrypt
      createdAt: new Date(),
      updatedAt: new Date()
    };

    users.set(user.id, user);
    return this._sanitizeUser(user);
  }

  /**
   * Get user by ID
   */
  static getUserById(userId) {
    const user = users.get(userId);
    if (!user) {
      throw new ApiError('User not found', 404);
    }
    return this._sanitizeUser(user);
  }

  /**
   * Get all users with pagination
   */
  static getAllUsers(page = 1, limit = 10) {
    const allUsers = Array.from(users.values());
    const total = allUsers.length;
    const startIndex = (page - 1) * limit;
    const paginatedUsers = allUsers.slice(startIndex, startIndex + limit);

    return {
      users: paginatedUsers.map(u => this._sanitizeUser(u)),
      total,
      page,
      limit
    };
  }

  /**
   * Update user
   */
  static updateUser(userId, updateData) {
    const user = users.get(userId);
    if (!user) {
      throw new ApiError('User not found', 404);
    }

    const updated = {
      ...user,
      ...updateData,
      updatedAt: new Date()
    };

    users.set(userId, updated);
    return this._sanitizeUser(updated);
  }

  /**
   * Delete user
   */
  static deleteUser(userId) {
    if (!users.has(userId)) {
      throw new ApiError('User not found', 404);
    }
    users.delete(userId);
    return true;
  }

  /**
   * Authenticate user (login)
   */
  static authenticateUser(username, password) {
    const user = Array.from(users.values()).find(
      u => u.username === username && u.password === password
    );

    if (!user) {
      throw new ApiError('Invalid credentials', 401);
    }

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
