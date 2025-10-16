import { apiClient } from './client';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN';
  status: string;
  joinDate: string;
  trips: number;
  places: number;
  provider?: string;
  avatar?: string;
}

export interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  newToday: number;
  admins: number;
  totalTrips: number;
  totalPlaces: number;
}

interface GetUsersResponse {
  success: boolean;
  users: AdminUser[];
}

interface GetStatsResponse {
  success: boolean;
  stats: AdminStats;
}

interface UpdateUserRoleResponse {
  success: boolean;
  user: {
    id: string;
    email: string;
    name: string;
    role: 'USER' | 'ADMIN';
  };
}

interface DeleteUserResponse {
  success: boolean;
  message: string;
}

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
