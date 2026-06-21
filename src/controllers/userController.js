import { UserService } from '../services/userService.js';
import { successResponse, paginatedResponse } from '../utils/response.js';
import { generateToken } from '../utils/jwtUtils.js';

/**
 * User Controller
 * Handles HTTP requests and responses for user endpoints
 */
export class UserController {
  /**
   * POST /api/v1/users/register
   */
  static async register(req, res, next) {
    try {
      const user = UserService.createUser(req.body);
      return res.status(201).json(successResponse(user, 'User created successfully', 201));
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v1/auth/login
   */
  static async login(req, res, next) {
    try {
      const { username, password } = req.body;
      const user = UserService.authenticateUser(username, password);
      
      const token = generateToken({
        id: user.id,
        username: user.username,
        email: user.email
      });

      return res.json(successResponse(
        { user, token },
        'Login successful'
      ));
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/users/:id
   */
  static async getUser(req, res, next) {
    try {
      const user = UserService.getUserById(req.params.id);
      return res.json(successResponse(user, 'User retrieved successfully'));
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/users
   */
  static async listUsers(req, res, next) {
    try {
      const { page = 1, limit = 10 } = req.query;
      const result = UserService.getAllUsers(parseInt(page), parseInt(limit));
      
      return res.json(paginatedResponse(
        result.users,
        result.page,
        result.limit,
        result.total,
        'Users retrieved successfully'
      ));
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/v1/users/:id
   */
  static async updateUser(req, res, next) {
    try {
      const user = UserService.updateUser(req.params.id, req.body);
      return res.json(successResponse(user, 'User updated successfully'));
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/v1/users/:id
   */
  static async deleteUser(req, res, next) {
    try {
      UserService.deleteUser(req.params.id);
      return res.json(successResponse(null, 'User deleted successfully'));
    } catch (error) {
      next(error);
    }
  }
}
