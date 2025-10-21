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

// Get system health
router.get('/health', (req, res) => adminController.getSystemHealth(req, res));

// Analytics routes
router.get('/analytics/metrics', (req, res) =>
  adminController.getAnalyticsMetrics(req, res)
);
router.get('/analytics/user-growth', (req, res) =>
  adminController.getUserGrowthChart(req, res)
);
router.get('/analytics/route-usage', (req, res) =>
  adminController.getRouteUsage(req, res)
);
router.get('/analytics/popular-routes', (req, res) =>
  adminController.getPopularRoutes(req, res)
);

// Update user role
router.patch('/users/:userId/role', (req, res) =>
  adminController.updateUserRole(req, res)
);

// Delete user
router.delete('/users/:userId', (req, res) =>
  adminController.deleteUser(req, res)
);

export default router;
