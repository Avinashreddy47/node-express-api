import { Router } from 'express';
import { UserController } from '../controllers/userController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { authLimiter } from '../middleware/rateLimiter.js';
import { validateRequest, schemas } from '../middleware/validationMiddleware.js';

const router = Router();

/**
 * Public Routes
 * Auth endpoints use stricter rate limiting
 */
router.post('/register', authLimiter, validateRequest(schemas.userCreate), UserController.register);

router.post('/login', authLimiter, validateRequest(schemas.login), UserController.login);

/**
 * Protected Routes
 */
router.get('/users', authMiddleware, UserController.listUsers);

router.get('/users/:id', authMiddleware, UserController.getUser);

router.put(
  '/users/:id',
  authMiddleware,
  validateRequest(schemas.userUpdate),
  UserController.updateUser,
);

router.delete('/users/:id', authMiddleware, UserController.deleteUser);

export default router;
