import { apiClient, setTokens, clearTokens, getRefreshToken, ApiResponse } from './client';

/**
 * Auth API Types
 */
export interface User {
  id: string;
  email: string;
  name: string | null;
  emailVerifiedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SignupRequest {
  email: string;
  password: string;
  name?: string;
}

export interface SignupResponse {
  userId: string;
  email: string;
  message: string;
}

export interface VerifyEmailRequest {
  email: string;
  code: string;
}

export interface VerifyEmailResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface ResendCodeRequest {
  email: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

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
  async verifyEmail(data: VerifyEmailRequest): Promise<VerifyEmailResponse> {
    const response = await apiClient.post<ApiResponse<VerifyEmailResponse>>(
      '/api/auth/verify',
      data
    );

    if (!response.success || !response.data) {
      throw new Error(response.error || 'Verification failed');
    }

    // Store tokens
    setTokens(response.data.accessToken, response.data.refreshToken);

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
  async login(data: LoginRequest): Promise<LoginResponse> {
    const response = await apiClient.post<ApiResponse<LoginResponse>>(
      '/api/auth/login',
      data
    );

    if (!response.success || !response.data) {
      throw new Error(response.error || 'Login failed');
    }

    // Store tokens
    setTokens(response.data.accessToken, response.data.refreshToken);

    return response.data;
  },

  /**
   * Refresh tokens
   */
  async refreshTokens(): Promise<RefreshTokenResponse> {
    const refreshToken = getRefreshToken();

    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await apiClient.post<ApiResponse<RefreshTokenResponse>>(
      '/api/auth/refresh',
      { refreshToken }
    );

    if (!response.success || !response.data) {
      throw new Error(response.error || 'Token refresh failed');
    }

    // Store new tokens
    setTokens(response.data.accessToken, response.data.refreshToken);

    return response.data;
  },

  /**
   * Logout
   */
  async logout(): Promise<void> {
    const refreshToken = getRefreshToken();

    if (refreshToken) {
      try {
        await apiClient.post('/api/auth/logout', { refreshToken });
      } catch (error) {
        // Ignore logout errors
        console.error('Logout error:', error);
      }
    }

    // Clear tokens regardless of API call result
    clearTokens();
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
