import api from './api';

// ============================================================================
// EVALUATION SERVICE
// ============================================================================

const USE_MOCK = import.meta.env.VITE_USE_MOCK_DATA === 'true';

export const evaluationService = {
  /**
   * Submit a peer evaluation
   */
  async submitEvaluation(activityId, targetStudentId, comment, scores) {
    if (USE_MOCK) {
      // Mock submission
      return {
        id: 'eval_' + Date.now(),
        message: 'Evaluation submitted successfully',
        analysis: {
          tags: ['Constructive', 'Specific', 'Polite'],
          sentimentScore: 0.85,
          usefulnessScore: 92,
          isFlagged: false
        }
      };
    }

    try {
      const response = await api.post('/student/evaluations/submit', {
        activityId,
        targetStudentId,
        comment,
        scores: scores.map(s => ({
          criterionName: s.criterionName,
          score: s.score
        }))
      });
      return response.data;
    } catch (error) {
      console.error('Error submitting evaluation:', error);
      throw error;
    }
  }
};

