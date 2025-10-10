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
    if (error.response) {
      // Server responded with error
      const errorMessage = error.response.data?.error || error.message || 'An error occurred';
      throw new ApiError(
        errorMessage,
        error.response.status,
        error.response.data
      );
    } else if (error.request) {
      // Request made but no response
      throw new ApiError('No response from server', 0);
    } else {
      // Something else happened
      throw new ApiError(error.message || 'Network error', 0);
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
