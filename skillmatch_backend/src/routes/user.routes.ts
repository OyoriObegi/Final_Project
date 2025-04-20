import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { UserService } from '../services/user.service';
import { authenticate, isAdmin } from '../middleware/auth.middleware';

const router = Router();
const userService = new UserService();
const userController = new UserController(userService);

// Public routes
router.post('/register', userController.register);
router.post('/login', userController.login);
router.post('/verify-email/:token', userController.verifyEmail);

// Protected routes
router.use(authenticate);
router.put('/profile', userController.updateProfile);
router.put('/change-password', userController.changePassword);
router.post('/deactivate', userController.deactivateAccount);

// Admin routes
router.get('/', isAdmin, userController.getAllUsers);
router.put('/:userId/status', isAdmin, userController.toggleUserStatus);
router.put('/:userId/role', isAdmin, userController.changeUserRole);

export default router; 