import { Router } from 'express';
import { UserController } from '../controllers/userController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { validateRequest, schemas } from '../middleware/validationMiddleware.js';

const router = Router();

/**
 * Public Routes
 */
router.post('/register',
  validateRequest(schemas.userCreate),
  UserController.register
);

router.post('/login',
  validateRequest(schemas.login),
  UserController.login
);

/**
 * Protected Routes
 */
router.get('/users',
  authMiddleware,
  UserController.listUsers
);

router.get('/users/:id',
  authMiddleware,
  UserController.getUser
);

router.put('/users/:id',
  authMiddleware,
  validateRequest(schemas.userUpdate),
  UserController.updateUser
);

router.delete('/users/:id',
  authMiddleware,
  UserController.deleteUser
);

export default router;
