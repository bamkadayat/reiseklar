/**
 * API Client configuration using Axios
 * Uses httpOnly cookies for token storage (no localStorage)
 */

import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public response?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Create axios instance with default configuration
 * Tokens are automatically sent via httpOnly cookies
 */
const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important: send cookies with requests
});

/**
 * Response interceptor for error handling
 */
axiosInstance.interceptors.response.use(
  (response) => response.data,
  (error: AxiosError<ApiResponse<any>>) => {
    // Don't log 401 errors for auth check endpoint - they're expected when logged out
    const isAuthCheck = error.config?.url?.includes('/api/users/me');
    const is401 = error.response?.status === 401;

    if (error.response) {
      // Server responded with error
      const errorMessage = error.response.data?.error || error.message || 'An error occurred';

      // Create error with proper constructor
      const apiError: any = new Error(errorMessage);
      apiError.name = 'ApiError';
      apiError.statusCode = error.response.status;
      apiError.response = error.response.data;

      // Silently throw for expected 401 on auth check
      if (isAuthCheck && is401) {
        throw apiError;
      }

      throw apiError;
    } else if (error.request) {
      // Request made but no response
      const apiError: any = new Error('No response from server');
      apiError.name = 'ApiError';
      apiError.statusCode = 0;
      throw apiError;
    } else {
      // Something else happened
      const apiError: any = new Error(error.message || 'Network error');
      apiError.name = 'ApiError';
      apiError.statusCode = 0;
      throw apiError;
    }
  }
);

/**
 * API Client with typed methods
 */
export const apiClient = {
  get: <T = any>(endpoint: string, config?: AxiosRequestConfig): Promise<T> =>
    axiosInstance.get(endpoint, config),

  post: <T = any>(endpoint: string, data?: any, config?: AxiosRequestConfig): Promise<T> =>
    axiosInstance.post(endpoint, data, config),

  put: <T = any>(endpoint: string, data?: any, config?: AxiosRequestConfig): Promise<T> =>
    axiosInstance.put(endpoint, data, config),

  delete: <T = any>(endpoint: string, config?: AxiosRequestConfig): Promise<T> =>
    axiosInstance.delete(endpoint, config),

  patch: <T = any>(endpoint: string, data?: any, config?: AxiosRequestConfig): Promise<T> =>
    axiosInstance.patch(endpoint, data, config),
};

// Export axios instance for advanced usage
export { axiosInstance };
