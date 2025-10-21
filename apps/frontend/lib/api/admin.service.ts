import { apiClient } from './client';
import type {
  AdminUser,
  AdminStats,
  SystemHealth,
  GetUsersResponse,
  GetStatsResponse,
  GetSystemHealthResponse,
  UpdateUserRoleResponse,
  DeleteUserResponse,
} from '@reiseklar/shared';

export const adminService = {
  /**
   * Get all users with their stats
   */
  async getUsers(): Promise<AdminUser[]> {
    const response = await apiClient.get<GetUsersResponse>('/api/admin/users');
    return response.users;
  },

  /**
   * Get dashboard statistics
   */
  async getStats(): Promise<AdminStats> {
    const response = await apiClient.get<GetStatsResponse>('/api/admin/stats');
    return response.stats;
  },

  /**
   * Get system health metrics
   */
  async getSystemHealth(): Promise<SystemHealth> {
    const response = await apiClient.get<GetSystemHealthResponse>('/api/admin/health');
    return response.health;
  },

  /**
   * Update user role
   */
  async updateUserRole(userId: string, role: 'USER' | 'ADMIN'): Promise<void> {
    await apiClient.patch<UpdateUserRoleResponse>(`/api/admin/users/${userId}/role`, {
      role,
    });
  },

  /**
   * Delete user
   */
  async deleteUser(userId: string): Promise<void> {
    await apiClient.delete<DeleteUserResponse>(`/api/admin/users/${userId}`);
  },
};
