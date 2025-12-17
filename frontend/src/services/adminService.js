import api from './api';
import { mockData } from './mockData';

// ============================================================================
// ADMIN SERVICE
// ============================================================================

const USE_MOCK = import.meta.env.VITE_USE_MOCK_DATA === 'true';

export const adminService = {
  /**
   * Get all users
   */
  async getAllUsers() {
    if (USE_MOCK) {
      return mockData.users;
    }

    try {
      const response = await api.get('/admin/users');
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },

  /**
   * Update user status
   */
  async updateUserStatus(userId, status) {
    if (USE_MOCK) {
      // Mock update
      const user = mockData.users.find(u => u.id === userId);
      if (user) {
        user.status = status;
      }
      return user;
    }

    try {
      const response = await api.put(`/admin/users/${userId}/status`, { status });
      return response.data;
    } catch (error) {
      console.error('Error updating user status:', error);
      throw error;
    }
  }
};

