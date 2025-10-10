/**
 * Shared validation schemas for both frontend and backend
 * This ensures consistent validation across the entire application
 */

export {
  // Schemas
  SignupRequestSchema,
  VerifyEmailRequestSchema,
  ResendCodeRequestSchema,
  LoginRequestSchema,
  ForgotPasswordRequestSchema,
  ResetPasswordRequestSchema,
  RefreshTokenRequestSchema,

  // For backend usage
  SignupRequestSchema as signupSchema,
  VerifyEmailRequestSchema as verifyEmailSchema,
  ResendCodeRequestSchema as resendCodeSchema,
  LoginRequestSchema as loginSchema,
  ForgotPasswordRequestSchema as forgotPasswordSchema,
  ResetPasswordRequestSchema as resetPasswordSchema,
  RefreshTokenRequestSchema as refreshTokenSchema,
} from '../types/auth';
