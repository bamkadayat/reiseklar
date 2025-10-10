import { apiClient, ApiResponse } from './client';
import type {
  User,
  SignupRequest,
  SignupResponse,
  VerifyEmailRequest,
  VerifyEmailResponse,
  ResendCodeRequest,
  LoginRequest,
  LoginResponse,
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
} from '@reiseklar/shared';

/**
 * Auth API Types - re-exported for convenience
 */
export type {
  User,
  SignupRequest,
  SignupResponse,
  VerifyEmailRequest,
  VerifyEmailResponse,
  ResendCodeRequest,
  LoginRequest,
  LoginResponse,
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
};

/**
 * Auth Service
 */
export const authService = {
  /**
   * Sign up a new user
   */
  async signup(data: SignupRequest): Promise<SignupResponse> {
    const response = await apiClient.post<ApiResponse<SignupResponse>>(
      '/api/auth/signup',
      data
    );

    if (!response.success || !response.data) {
      throw new Error(response.error || 'Signup failed');
    }

    return response.data;
  },

  /**
   * Verify email with code
   */
  async verifyEmail(data: VerifyEmailRequest): Promise<{ user: User }> {
    const response = await apiClient.post<ApiResponse<{ user: User }>>(
      '/api/auth/verify',
      data
    );

    if (!response.success || !response.data) {
      throw new Error(response.error || 'Verification failed');
    }

    // Tokens are now set as httpOnly cookies by the backend
    return response.data;
  },

  /**
   * Resend verification code
   */
  async resendVerificationCode(data: ResendCodeRequest): Promise<{ message: string }> {
    const response = await apiClient.post<ApiResponse<{ message: string }>>(
      '/api/auth/resend-code',
      data
    );

    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to resend code');
    }

    return response.data;
  },

  /**
   * Login
   */
  async login(data: LoginRequest): Promise<{ user: User }> {
    const response = await apiClient.post<ApiResponse<{ user: User }>>(
      '/api/auth/login',
      data
    );

    if (!response.success || !response.data) {
      throw new Error(response.error || 'Login failed');
    }

    // Tokens are now set as httpOnly cookies by the backend
    return response.data;
  },

  /**
   * Refresh tokens
   */
  async refreshTokens(): Promise<void> {
    const response = await apiClient.post<ApiResponse<{ message: string }>>(
      '/api/auth/refresh',
      {}
    );

    if (!response.success) {
      throw new Error(response.error || 'Token refresh failed');
    }

    // Tokens are now refreshed as httpOnly cookies by the backend
  },

  /**
   * Logout
   */
  async logout(): Promise<void> {
    try {
      await apiClient.post('/api/auth/logout', {});
    } catch (error) {
      // Ignore logout errors
      console.error('Logout error:', error);
    }

    // Cookies are cleared by the backend
  },

  /**
   * Request password reset
   */
  async forgotPassword(data: ForgotPasswordRequest): Promise<ForgotPasswordResponse> {
    const response = await apiClient.post<ApiResponse<ForgotPasswordResponse>>(
      '/api/auth/forgot-password',
      data
    );

    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to request password reset');
    }

    return response.data;
  },

  /**
   * Reset password with token
   */
  async resetPassword(data: ResetPasswordRequest): Promise<ResetPasswordResponse> {
    const response = await apiClient.post<ApiResponse<ResetPasswordResponse>>(
      '/api/auth/reset-password',
      data
    );

    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to reset password');
    }

    return response.data;
  },

  /**
   * Get current user profile
   */
  async getProfile(): Promise<User> {
    const response = await apiClient.get<ApiResponse<User>>('/api/users/me');

    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to fetch profile');
    }

    return response.data;
  },
};
