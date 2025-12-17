import api from './api';
import { mockData } from './mockData';

// ============================================================================
// ACTIVITY SERVICE
// ============================================================================

const USE_MOCK = import.meta.env.VITE_USE_MOCK_DATA === 'true';

export const activityService = {
  /**
   * Get all activities
   */
  async getAllActivities() {
    if (USE_MOCK) {
      return mockData.activities;
    }

    try {
      const response = await api.get('/teacher/activities');
      return response.data;
    } catch (error) {
      console.error('Error fetching activities:', error);
      throw error;
    }
  },

  /**
   * Create new activity
   */
  async createActivity(name, rubricId, dueDate, participantIds) {
    if (USE_MOCK) {
      // Mock creation
      return {
        id: 'a' + Date.now(),
        name,
        rubricId,
        dueDate,
        status: 'active',
        participants: participantIds?.length || 0
      };
    }

    try {
      const response = await api.post('/teacher/activities', {
        name,
        rubricId,
        dueDate,
        participantIds: participantIds || []
      });
      return response.data;
    } catch (error) {
      console.error('Error creating activity:', error);
      throw error;
    }
  },

  /**
   * Get all rubrics
   */
  async getRubrics() {
    if (USE_MOCK) {
      return mockData.rubrics;
    }

    try {
      const response = await api.get('/teacher/rubrics');
      return response.data;
    } catch (error) {
      console.error('Error fetching rubrics:', error);
      throw error;
    }
  },

  /**
   * Export activity data as CSV
   */
  async exportActivityCSV(activityId) {
    try {
      // Try new endpoint first, fallback to teacher endpoint
      const response = await api.get(`/activities/${activityId}/export`, {
        responseType: 'blob'
      }).catch(() => 
        api.get(`/teacher/activities/${activityId}/export`, {
          responseType: 'blob'
        })
      );
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `activity_${activityId}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting CSV:', error);
      throw error;
    }
  }
};

