import { Router } from 'express';
import { userController } from '../controllers/user.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// All routes require authentication
router.use(authenticate);

// GET /api/users/me - Get current user profile
router.get('/me', (req, res) => userController.getProfile(req, res));

export default router;
