import api from './api';
import { mockData } from './mockData';

const USE_MOCK = import.meta.env.VITE_USE_MOCK_DATA === 'true';

export const groupService = {
  async getAllGroups() {
    if (USE_MOCK) {
      return [];
    }

    try {
      // Try new endpoint first, fallback to old
      const response = await api.get('/groups').catch(() => 
        api.get('/teacher/groups')
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching groups:', error);
      throw error;
    }
  },

  async createGroup(name, memberIds) {
    if (USE_MOCK) {
      return { id: 'g' + Date.now(), name, members: [], memberCount: 0 };
    }

    try {
      // Try new endpoint first, fallback to old
      const response = await api.post('/groups', { name, activityId: null }).catch(() => 
        api.post('/teacher/groups', { name, memberIds })
      );
      return response.data;
    } catch (error) {
      console.error('Error creating group:', error);
      throw error;
    }
  },

  async assignStudentToGroup(groupId, studentId) {
    if (USE_MOCK) {
      return { id: groupId, members: [], memberCount: 0 };
    }

    try {
      const response = await api.post(`/groups/${groupId}/assign`, { studentId });
      return response.data;
    } catch (error) {
      console.error('Error assigning student to group:', error);
      throw error;
    }
  },

  async removeStudentFromGroup(groupId, studentId) {
    if (USE_MOCK) {
      return;
    }

    try {
      await api.delete(`/groups/${groupId}/remove?studentId=${studentId}`);
    } catch (error) {
      console.error('Error removing student from group:', error);
      throw error;
    }
  },

  async updateGroup(groupId, name, memberIds) {
    if (USE_MOCK) {
      return { id: groupId, name, members: [], memberCount: 0 };
    }

    try {
      const response = await api.put(`/teacher/groups/${groupId}`, { name, memberIds });
      return response.data;
    } catch (error) {
      console.error('Error updating group:', error);
      throw error;
    }
  },

  async deleteGroup(groupId) {
    if (USE_MOCK) {
      return;
    }

    try {
      await api.delete(`/teacher/groups/${groupId}`);
    } catch (error) {
      console.error('Error deleting group:', error);
      throw error;
    }
  },

  async addMemberToGroup(groupId, userId) {
    if (USE_MOCK) {
      return { id: groupId, members: [], memberCount: 0 };
    }

    try {
      const response = await api.post(`/teacher/groups/${groupId}/members/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error adding member to group:', error);
      throw error;
    }
  },

  async removeMemberFromGroup(groupId, userId) {
    if (USE_MOCK) {
      return { id: groupId, members: [], memberCount: 0 };
    }

    try {
      const response = await api.delete(`/teacher/groups/${groupId}/members/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error removing member from group:', error);
      throw error;
    }
  }
};

