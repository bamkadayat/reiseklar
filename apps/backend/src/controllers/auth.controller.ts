import { Request, Response } from 'express';
import { authService } from '../services/auth.service';
import { signupSchema, verifyEmailSchema, loginSchema, refreshTokenSchema, resendCodeSchema } from '../utils/validation';
import { ZodError } from 'zod';

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
      const { refreshToken } = refreshTokenSchema.parse(req.body);

      const result = await authService.refreshTokens(refreshToken);

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
      const { refreshToken } = req.body;

      if (refreshToken) {
        await authService.logout(refreshToken);
      }

      res.status(200).json({
        success: true,
        message: 'Logged out successfully',
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  }
}

export const authController = new AuthController();
