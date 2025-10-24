import { z } from 'zod';

// ============================================
// USER TYPES
// ============================================

export enum Role {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

export const UserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string().nullable(),
  emailVerifiedAt: z.string().nullable(),
  role: z.nativeEnum(Role),
  googleId: z.string().nullable().optional(),
  provider: z.enum(['local', 'google']).nullable().optional(),
  avatar: z.string().nullable().optional(),
  theme: z.enum(['light', 'dark', 'system']).nullable().optional(),
  language: z.enum(['en', 'nb']).nullable().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type User = z.infer<typeof UserSchema>;

// ============================================
// AUTH REQUEST/RESPONSE TYPES
// ============================================

// Signup
export const SignupRequestSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
});

export const SignupResponseSchema = z.object({
  userId: z.string(),
  email: z.string().email(),
  message: z.string(),
});

export type SignupRequest = z.infer<typeof SignupRequestSchema>;
export type SignupResponse = z.infer<typeof SignupResponseSchema>;

// Email Verification
export const VerifyEmailRequestSchema = z.object({
  email: z.string().email('Invalid email address'),
  code: z.string().length(4, 'Code must be 4 digits').regex(/^\d{4}$/, 'Code must be numeric'),
});

export const VerifyEmailResponseSchema = z.object({
  user: UserSchema,
});

export type VerifyEmailRequest = z.infer<typeof VerifyEmailRequestSchema>;
export type VerifyEmailResponse = z.infer<typeof VerifyEmailResponseSchema>;

// Resend Verification Code
export const ResendCodeRequestSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export type ResendCodeRequest = z.infer<typeof ResendCodeRequestSchema>;

// Login
export const LoginRequestSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const LoginResponseSchema = z.object({
  user: UserSchema,
});

export type LoginRequest = z.infer<typeof LoginRequestSchema>;
export type LoginResponse = z.infer<typeof LoginResponseSchema>;

// Forgot Password
export const ForgotPasswordRequestSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export const ForgotPasswordResponseSchema = z.object({
  message: z.string(),
});

export type ForgotPasswordRequest = z.infer<typeof ForgotPasswordRequestSchema>;
export type ForgotPasswordResponse = z.infer<typeof ForgotPasswordResponseSchema>;

// Reset Password
export const ResetPasswordRequestSchema = z.object({
  email: z.string().email('Invalid email address'),
  code: z.string().length(4, 'Code must be 4 digits').regex(/^\d{4}$/, 'Code must be numeric'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
});

export const ResetPasswordResponseSchema = z.object({
  message: z.string(),
});

export type ResetPasswordRequest = z.infer<typeof ResetPasswordRequestSchema>;
export type ResetPasswordResponse = z.infer<typeof ResetPasswordResponseSchema>;

// Refresh Token
export const RefreshTokenRequestSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required'),
});

export type RefreshTokenRequest = z.infer<typeof RefreshTokenRequestSchema>;

// ============================================
// COMMON API RESPONSE WRAPPER
// ============================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  details?: any;
}
