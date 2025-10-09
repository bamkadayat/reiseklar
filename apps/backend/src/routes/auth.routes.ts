import { Router } from 'express';
import { authController } from '../controllers/auth.controller';

const router = Router();

// POST /api/auth/signup - Register a new user
router.post('/signup', (req, res) => authController.signup(req, res));

// POST /api/auth/verify - Verify email with code
router.post('/verify', (req, res) => authController.verifyEmail(req, res));

// POST /api/auth/resend-code - Resend verification code
router.post('/resend-code', (req, res) => authController.resendCode(req, res));

// POST /api/auth/login - Login with email and password
router.post('/login', (req, res) => authController.login(req, res));

// POST /api/auth/refresh - Refresh access token
router.post('/refresh', (req, res) => authController.refresh(req, res));

// POST /api/auth/logout - Logout and revoke refresh token
router.post('/logout', (req, res) => authController.logout(req, res));

export default router;
