import api from './api';
import { mockData } from './mockData';

// ============================================================================
// DASHBOARD SERVICE
// ============================================================================

const USE_MOCK = import.meta.env.VITE_USE_MOCK_DATA === 'true';

export const dashboardService = {
  /**
   * Get student dashboard data
   */
  async getStudentDashboard() {
    if (USE_MOCK) {
      return mockData.students[0];
    }

    try {
      const response = await api.get('/student/dashboard');
      return response.data;
    } catch (error) {
      console.error('Error fetching student dashboard:', error);
      throw error;
    }
  },

  /**
   * Get teacher class analytics
   */
  async getClassAnalytics() {
    if (USE_MOCK) {
      return mockData.classData;
    }

    try {
      const response = await api.get('/teacher/class-overview');
      return response.data;
    } catch (error) {
      console.error('Error fetching class analytics:', error);
      throw error;
    }
  },

  /**
   * Get student list for teacher
   */
  async getStudentList() {
    if (USE_MOCK) {
      return mockData.students;
    }

    try {
      const response = await api.get('/teacher/students');
      return response.data;
    } catch (error) {
      console.error('Error fetching student list:', error);
      throw error;
    }
  },

  /**
   * Get ungrouped students
   */
  async getUngroupedStudents() {
    if (USE_MOCK) {
      return mockData.students.filter(s => !s.groupId);
    }

    try {
      const response = await api.get('/teacher/students/ungrouped');
      return response.data;
    } catch (error) {
      console.error('Error fetching ungrouped students:', error);
      throw error;
    }
  }
};

