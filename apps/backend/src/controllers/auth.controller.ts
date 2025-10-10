import { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import { authService } from '../services/auth.service';
import { signupSchema, verifyEmailSchema, loginSchema, refreshTokenSchema, resendCodeSchema, forgotPasswordSchema, resetPasswordSchema } from '../utils/validation';
import { ZodError } from 'zod';
import { generateTokenPair } from '../utils/jwt';
import { hashPassword } from '../utils/password';

export class AuthController {
  // POST /api/auth/signup
  async signup(req: Request, res: Response) {
    try {
      const { email, password, name } = signupSchema.parse(req.body);

      const result = await authService.signup(email, password, name);

      res.status(201).json({
        success: true,
        data: result,
      });
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          success: false,
          error: 'Validation error',
          details: error.errors,
        });
      }

      if (error instanceof Error) {
        return res.status(400).json({
          success: false,
          error: error.message,
        });
      }

      res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  }

  // POST /api/auth/verify
  async verifyEmail(req: Request, res: Response) {
    try {
      const { email, code } = verifyEmailSchema.parse(req.body);

      const result = await authService.verifyEmail(email, code);

      // Set httpOnly cookies for tokens
      res.cookie('accessToken', result.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 15 * 60 * 1000, // 15 minutes
      });

      res.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      // Return user data only (no tokens in response body)
      res.status(200).json({
        success: true,
        data: {
          user: result.user,
        },
      });
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          success: false,
          error: 'Validation error',
          details: error.errors,
        });
      }

      if (error instanceof Error) {
        return res.status(400).json({
          success: false,
          error: error.message,
        });
      }

      res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  }

  // POST /api/auth/resend-code
  async resendCode(req: Request, res: Response) {
    try {
      const { email } = resendCodeSchema.parse(req.body);

      const result = await authService.resendVerificationCode(email);

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          success: false,
          error: 'Validation error',
          details: error.errors,
        });
      }

      if (error instanceof Error) {
        return res.status(400).json({
          success: false,
          error: error.message,
        });
      }

      res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  }

  // POST /api/auth/login
  async login(req: Request, res: Response) {
    try {
      const { email, password } = loginSchema.parse(req.body);

      const result = await authService.login(email, password);

      // Set httpOnly cookies for tokens
      res.cookie('accessToken', result.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 15 * 60 * 1000, // 15 minutes
      });

      res.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      // Return user data only (no tokens in response body)
      res.status(200).json({
        success: true,
        data: {
          user: result.user,
        },
      });
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          success: false,
          error: 'Validation error',
          details: error.errors,
        });
      }

      if (error instanceof Error) {
        return res.status(401).json({
          success: false,
          error: error.message,
        });
      }

      res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  }

  // POST /api/auth/refresh
  async refresh(req: Request, res: Response) {
    try {
      // Get refresh token from cookie instead of body
      const refreshToken = req.cookies?.refreshToken;

      if (!refreshToken) {
        return res.status(401).json({
          success: false,
          error: 'No refresh token provided',
        });
      }

      const result = await authService.refreshTokens(refreshToken);

      // Set new httpOnly cookies for tokens
      res.cookie('accessToken', result.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 15 * 60 * 1000, // 15 minutes
      });

      res.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      res.status(200).json({
        success: true,
        data: { message: 'Tokens refreshed' },
      });
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          success: false,
          error: 'Validation error',
          details: error.errors,
        });
      }

      if (error instanceof Error) {
        return res.status(401).json({
          success: false,
          error: error.message,
        });
      }

      res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  }

  // POST /api/auth/logout
  async logout(req: Request, res: Response) {
    try {
      // Get refresh token from cookie
      const refreshToken = req.cookies?.refreshToken;

      if (refreshToken) {
        await authService.logout(refreshToken);
      }

      // Clear cookies
      res.clearCookie('accessToken');
      res.clearCookie('refreshToken');

      res.status(200).json({
        success: true,
        data: { message: 'Logged out successfully' },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  }

  // POST /api/auth/forgot-password
  async forgotPassword(req: Request, res: Response) {
    try {
      const { email } = forgotPasswordSchema.parse(req.body);

      const result = await authService.requestPasswordReset(email);

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          success: false,
          error: 'Validation error',
          details: error.errors,
        });
      }

      if (error instanceof Error) {
        return res.status(400).json({
          success: false,
          error: error.message,
        });
      }

      res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  }

  // POST /api/auth/reset-password
  async resetPassword(req: Request, res: Response) {
    try {
      const { token, password } = resetPasswordSchema.parse(req.body);

      const result = await authService.resetPassword(token, password);

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          success: false,
          error: 'Validation error',
          details: error.errors,
        });
      }

      if (error instanceof Error) {
        return res.status(400).json({
          success: false,
          error: error.message,
        });
      }

      res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  }

  // GET /api/auth/google - Initiate Google OAuth
  googleAuth(req: Request, res: Response, next: NextFunction) {
    passport.authenticate('google', {
      scope: ['profile', 'email'],
      session: false,
    })(req, res, next);
  }

  // GET /api/auth/google/callback - Google OAuth callback
  async googleCallback(req: Request, res: Response, next: NextFunction) {
    passport.authenticate('google', { session: false }, async (err: any, user: any) => {
      try {
        if (err || !user) {
          console.error('Google OAuth callback error:', err || 'No user returned');
          const errorUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/signIn?error=oauth_failed`;
          return res.redirect(errorUrl);
        }

        // Generate tokens
        const tokens = generateTokenPair({ userId: user.id, email: user.email });

        // Store refresh token
        const tokenHash = await hashPassword(tokens.refreshToken);
        await require('../utils/prisma').prisma.refreshToken.create({
          data: {
            userId: user.id,
            tokenHash,
          },
        });

        // Set httpOnly cookies
        res.cookie('accessToken', tokens.accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 15 * 60 * 1000, // 15 minutes
        });

        res.cookie('refreshToken', tokens.refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        // Redirect to frontend success page
        const successUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/user`;
        res.redirect(successUrl);
      } catch (error) {
        console.error('Google OAuth callback error:', error);
        const errorUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/signIn?error=oauth_failed`;
        res.redirect(errorUrl);
      }
    })(req, res);
  }
}

export const authController = new AuthController();
