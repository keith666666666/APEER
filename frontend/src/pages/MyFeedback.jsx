import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MessageSquare, Smile, Meh, Frown, User, FileText } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { studentService } from '../services/studentService';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

const MyFeedback = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [feedbackHistory, setFeedbackHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchFeedbackHistory();
  }, []);

  const fetchFeedbackHistory = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const history = await studentService.getFeedbackHistory();
      setFeedbackHistory(history);
    } catch (err) {
      console.error('Error fetching feedback history:', err);
      setError('Failed to load feedback history');
    } finally {
      setIsLoading(false);
    }
  };

  const getSentimentIcon = (label) => {
    if (!label) return <Meh className="w-5 h-5 text-yellow-400" />;
    
    const lowerLabel = label.toLowerCase();
    if (lowerLabel.includes('positive') || lowerLabel.includes('constructive') || lowerLabel.includes('encouraging')) {
      return <Smile className="w-5 h-5 text-green-400" />;
    }
    if (lowerLabel.includes('negative') || lowerLabel.includes('vague') || lowerLabel.includes('unclear')) {
      return <Frown className="w-5 h-5 text-red-400" />;
    }
    return <Meh className="w-5 h-5 text-yellow-400" />;
  };

  const getSentimentBadgeColor = (label) => {
    if (!label) return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
    
    const lowerLabel = label.toLowerCase();
    if (lowerLabel.includes('positive') || lowerLabel.includes('constructive') || lowerLabel.includes('encouraging')) {
      return 'bg-green-500/20 text-green-300 border-green-500/30';
    }
    if (lowerLabel.includes('negative') || lowerLabel.includes('vague') || lowerLabel.includes('unclear')) {
      return 'bg-red-500/20 text-red-300 border-red-500/30';
    }
    return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading feedback...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/student')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card spotlight className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <MessageSquare className="w-8 h-8 text-teal-400" />
              <h1 className="text-3xl font-bold">My Feedback</h1>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400">
                {error}
              </div>
            )}

            {feedbackHistory.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {feedbackHistory.map((feedback, idx) => {
                  const isSelfEval = feedback.isSelfEvaluation === true;
                  const borderColor = isSelfEval 
                    ? 'border-blue-500/50 hover:border-blue-400' 
                    : 'border-gray-800 hover:border-teal-500/50';
                  
                  return (
                    <motion.div
                      key={feedback.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className={`bg-gray-900/50 border ${borderColor} rounded-xl p-6 transition-colors backdrop-blur-lg`}
                    >
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            isSelfEval 
                              ? 'bg-gradient-to-br from-blue-500 to-blue-600' 
                              : 'bg-gradient-to-br from-teal-500 to-purple-600'
                          }`}>
                            {isSelfEval ? (
                              <FileText className="w-5 h-5 text-white" />
                            ) : (
                              <User className="w-5 h-5 text-white" />
                            )}
                          </div>
                          <div>
                            <div className={`font-semibold ${
                              isSelfEval ? 'text-blue-300' : 'text-white'
                            }`}>
                              {isSelfEval ? '📝 Self-Reflection' : '👤 Anonymous Peer'}
                            </div>
                            <div className="text-xs text-gray-400">{feedback.activityName}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {getSentimentIcon(feedback.sentimentLabel || feedback.aiSentiment)}
                          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getSentimentBadgeColor(feedback.sentimentLabel || feedback.aiSentiment)}`}>
                            {feedback.aiSentiment || feedback.sentimentLabel || 'Neutral'}
                          </span>
                        </div>
                      </div>

                    {/* Comment */}
                    <div className="mb-4">
                      <p className="text-gray-300 text-sm leading-relaxed line-clamp-4">
                        {feedback.comment}
                      </p>
                    </div>

                    {/* Rubric Scores Grid */}
                    {feedback.rubricScores && feedback.rubricScores.length > 0 && (
                      <div className="mb-4 pt-4 border-t border-gray-800">
                        <div className="text-xs text-gray-400 mb-3 font-medium">Rubric Scores:</div>
                        <div className="grid grid-cols-1 gap-2">
                          {feedback.rubricScores.map((score, i) => (
                            <div 
                              key={i} 
                              className="flex items-center justify-between p-2 bg-gray-800/30 rounded-lg"
                            >
                              <span className="text-gray-300 text-sm capitalize">
                                {score.criterionName}:
                              </span>
                              <span className={`font-semibold text-sm ${
                                isSelfEval ? 'text-blue-400' : 'text-teal-400'
                              }`}>
                                {score.score}/{score.maxScore}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-800">
                      <div className="text-right">
                        <div className={`text-2xl font-bold ${
                          isSelfEval ? 'text-blue-400' : 'text-teal-400'
                        }`}>
                          {Math.round(feedback.overallScore || 0)}
                        </div>
                        <div className="text-xs text-gray-500">Overall Score</div>
                      </div>
                      {feedback.submittedAt && (
                        <div className="text-xs text-gray-500">
                          {new Date(feedback.submittedAt).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </motion.div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-16">
                <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-600 opacity-50" />
                <p className="text-gray-400 text-lg">No feedback received yet</p>
                <p className="text-gray-500 text-sm mt-2">
                  Feedback from your peers will appear here once they submit evaluations.
                </p>
              </div>
            )}
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default MyFeedback;

