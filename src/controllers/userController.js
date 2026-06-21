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
   * Advanced search with filtering, sorting, and pagination
   * Query examples:
   *   - /users?search=john - Global search
   *   - /users?username_contains=john - Filter by username
   *   - /users?email_eq=test@gmail.com - Exact email match
   *   - /users?createdAt_gte=2024-01-01 - Filter by date range
   *   - /users?sort=-createdAt,username - Sort by multiple fields
   *   - /users?page=2&limit=20 - Pagination
   *   - /users?search=john&sort=-createdAt&page=1&limit=10 - Combined
   */
  static listUsers = asyncHandler(async (req, res) => {
    const result = UserService.queryUsers(req.query);

    return res.json(
      paginatedResponse(
        result.users,
        result.pagination.page,
        result.pagination.limit,
        result.pagination.total,
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
