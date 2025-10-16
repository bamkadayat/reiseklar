import { Router } from 'express';
import { authenticate, requireAdmin } from '../middleware/auth.middleware';
import { adminController } from '../controllers/admin.controller';

const router = Router();

// All admin routes require authentication and admin role
router.use(authenticate);
router.use(requireAdmin);

// Get all users
router.get('/users', (req, res) => adminController.getUsers(req, res));

// Get dashboard stats
router.get('/stats', (req, res) => adminController.getStats(req, res));

// Update user role
router.patch('/users/:userId/role', (req, res) =>
  adminController.updateUserRole(req, res)
);

// Delete user
router.delete('/users/:userId', (req, res) =>
  adminController.deleteUser(req, res)
);

export default router;
