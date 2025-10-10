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

// POST /api/auth/forgot-password - Request password reset
router.post('/forgot-password', (req, res) => authController.forgotPassword(req, res));

// POST /api/auth/reset-password - Reset password with token
router.post('/reset-password', (req, res) => authController.resetPassword(req, res));

// GET /api/auth/google - Initiate Google OAuth
router.get('/google', (req, res, next) => authController.googleAuth(req, res, next));

// GET /api/auth/google/callback - Google OAuth callback
router.get('/google/callback', (req, res, next) => authController.googleCallback(req, res, next));

export default router;
