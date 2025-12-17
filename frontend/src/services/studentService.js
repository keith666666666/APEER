import api from './api';
import { mockData } from './mockData';

const USE_MOCK = import.meta.env.VITE_USE_MOCK_DATA === 'true';

export const studentService = {
  async getFeedbackHistory() {
    if (USE_MOCK) {
      return [
        {
          id: '1',
          comment: 'Great collaboration skills!',
          evaluatorName: 'Anonymous Peer',
          sentimentScore: 0.8,
          sentimentLabel: 'Positive',
          overallScore: 85,
          submittedAt: new Date().toISOString(),
          activityName: 'Midterm Peer Review'
        }
      ];
    }

    try {
      const response = await api.get('/student/feedback-history');
      return response.data;
    } catch (error) {
      console.error('Error fetching feedback history:', error);
      throw error;
    }
  },

  async exportPersonalReport() {
    try {
      const response = await api.get('/student/export/pdf', {
        responseType: 'blob'
      });
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'personal_report.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting report:', error);
      throw error;
    }
  }
};

