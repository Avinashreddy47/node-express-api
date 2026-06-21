import { UserService } from '../services/userService.js';
import { successResponse, paginatedResponse } from '../utils/response.js';
import { generateToken } from '../utils/jwtUtils.js';
import { asyncHandler } from '../utils/asyncHandler.js';

/**
 * User Controller
 * Handles HTTP requests and responses for user endpoints
 */
export class UserController {
  /**
   * POST /api/v1/users/register
   */
  static register = asyncHandler(async (req, res) => {
    const user = await UserService.createUser(req.body);
    return res.status(201).json(successResponse(user, 'User created successfully', 201));
  });

  /**
   * POST /api/v1/auth/login
   */
  static login = asyncHandler(async (req, res) => {
    const { username, password } = req.body;
    const user = await UserService.authenticateUser(username, password);

    const token = generateToken({
      id: user.id,
      username: user.username,
      email: user.email,
    });

    return res.json(successResponse({ user, token }, 'Login successful'));
  });

  /**
   * GET /api/v1/users/:id
   */
  static getUser = asyncHandler(async (req, res) => {
    const user = UserService.getUserById(req.params.id);
    return res.json(successResponse(user, 'User retrieved successfully'));
  });

  /**
   * GET /api/v1/users
   */
  static listUsers = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    const result = UserService.getAllUsers(parseInt(page), parseInt(limit));

    return res.json(
      paginatedResponse(
        result.users,
        result.page,
        result.limit,
        result.total,
        'Users retrieved successfully',
      ),
    );
  });

  /**
   * PUT /api/v1/users/:id
   */
  static updateUser = asyncHandler(async (req, res) => {
    const user = await UserService.updateUser(req.params.id, req.body);
    return res.json(successResponse(user, 'User updated successfully'));
  });

  /**
   * DELETE /api/v1/users/:id
   */
  static deleteUser = asyncHandler(async (req, res) => {
    UserService.deleteUser(req.params.id);
    return res.json(successResponse(null, 'User deleted successfully'));
  });
}
