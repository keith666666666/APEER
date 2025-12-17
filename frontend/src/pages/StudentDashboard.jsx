import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { LogOut, TrendingUp, Plus, FileText, Sparkles, CheckCircle2, Target, Zap, Award, Clock, AlertCircle, MessageSquare, Smile, Meh, Frown, Download } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import { useAuth } from '../context/AuthContext';
import { dashboardService } from '../services/dashboardService';
import { studentService } from '../services/studentService';
import { profileService } from '../services/profileService';
import { mockData } from '../services/mockData';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { EvaluationFormModal } from '../components/student/EvaluationFormModal';
import { InsightsCard } from '../components/student/InsightsCard';

// ============================================================================
// STUDENT DASHBOARD
// ============================================================================
const StudentDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [feedbackHistory, setFeedbackHistory] = useState([]);
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEvalForm, setShowEvalForm] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const [dashboardData, history, profileData] = await Promise.all([
          dashboardService.getStudentDashboard(),
          studentService.getFeedbackHistory(),
          profileService.getProfile().catch(() => null)
        ]);
        setStudent(dashboardData);
        setFeedbackHistory(history);
        setProfile(profileData);
      } catch (err) {
        console.error('Error fetching student dashboard:', err);
        setError('Failed to load dashboard data. Using mock data.');
        // Fallback to mock data
        setStudent(mockData.students[0]);
        setFeedbackHistory([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const getSentimentIcon = (label) => {
    switch (label?.toLowerCase()) {
      case 'positive':
        return <Smile className="w-5 h-5 text-green-400" />;
      case 'negative':
        return <Frown className="w-5 h-5 text-red-400" />;
      default:
        return <Meh className="w-5 h-5 text-yellow-400" />;
    }
  };

  const getSentimentBadgeColor = (label) => {
    switch (label?.toLowerCase()) {
      case 'positive':
        return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'negative':
        return 'bg-red-500/20 text-red-300 border-red-500/30';
      default:
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (isLoading) {
    return (
      <div className="student-dashboard flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="student-dashboard flex items-center justify-center min-h-screen">
        <Card className="max-w-md">
          <div className="flex items-center gap-3 text-red-400 mb-4">
            <AlertCircle className="w-6 h-6" />
            <h3 className="text-xl font-semibold">Error Loading Dashboard</h3>
          </div>
          <p className="text-gray-400 mb-4">{error || 'Unable to load dashboard data.'}</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="student-dashboard">
      {/* Header */}
      <div className="student-header">
        <div>
          <h1 className="student-header-title">Welcome back, {student.name || user?.name || 'Student'}</h1>
          <p className="student-header-subtitle">Your evaluation dashboard</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            onClick={async () => {
              try {
                await studentService.exportPersonalReport();
              } catch (err) {
                console.error('Error exporting report:', err);
                alert('Failed to export report. Please try again.');
              }
            }}
            title="Export Personal Report"
          >
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/profile')}
            className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-teal-500/50 hover:border-teal-400 transition-colors"
            title="View Profile"
          >
            {profile?.avatarUrl ? (
              <img
                src={profile.avatarUrl.startsWith('http') ? profile.avatarUrl : `http://localhost:8080${profile.avatarUrl}`}
                alt="Profile"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
            ) : null}
            <div className={`w-full h-full bg-gradient-to-br from-teal-500 to-purple-600 flex items-center justify-center text-white font-bold ${profile?.avatarUrl ? 'hidden' : ''}`}>
              {(profile?.name || user?.name || 'U').charAt(0).toUpperCase()}
            </div>
          </motion.button>
          <Button variant="ghost" onClick={handleLogout}>
            <LogOut className="student-action-icon" />
            Logout
          </Button>
        </div>
      </div>

      {/* Bento Grid */}
      <div className="student-grid">
        {/* Overall Score */}
        <Card spotlight className="student-score-card">
          <div className="student-score-header">
            <h3 className="student-score-title">Overall Score</h3>
            <Award className="student-score-icon" />
          </div>
          <div className="student-score-circle-container">
            <svg className="w-full h-full -rotate-90">
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="8"
                fill="none"
              />
              <motion.circle
                cx="64"
                cy="64"
                r="56"
                stroke="url(#gradient)"
                strokeWidth="8"
                fill="none"
                strokeLinecap="round"
                initial={{ strokeDasharray: "0 352" }}
                animate={{ strokeDasharray: `${(student.overallScore / 100) * 352} 352` }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#00BFA5" />
                  <stop offset="100%" stopColor="#7C3AED" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="student-score-value">{student.overallScore}</span>
            </div>
          </div>
          <p className="student-score-participation">Participation: {student.participationRate}%</p>
        </Card>

        {/* Feedback Quality */}
        <Card spotlight className="student-score-card">
          <div className="student-score-header">
            <h3 className="student-score-title">Feedback Quality</h3>
            <TrendingUp className="student-score-icon" />
          </div>
          <div className="flex items-center justify-center h-32">
            <div className="text-center">
              <motion.div
                className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-purple-400"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
              >
                {student.feedbackQuality}
              </motion.div>
              <p className="text-gray-400 text-sm mt-2">Exceptional</p>
            </div>
          </div>
        </Card>

        {/* Pending Reviews */}
        <Card spotlight className="student-score-card">
          <div className="student-score-header">
            <h3 className="student-score-title">Pending Reviews</h3>
            <Clock className="student-score-icon" />
          </div>
          <div className="flex items-center justify-center h-32">
            <motion.div
              className="text-6xl font-bold text-teal-400"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 150, delay: 0.3 }}
            >
              {student.pendingReviews}
            </motion.div>
          </div>
        </Card>
      </div>

      {/* Bento Grid Layout - Performance View */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Sentiment Trend Chart */}
        <Card spotlight className="student-summary-card">
          <h3 className="student-summary-title mb-6">Sentiment Trend (Last 5 Evaluations)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={student.sentimentTrend || []}>
              <defs>
                <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00BFA5" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#00BFA5" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="week" stroke="#666" />
              <YAxis stroke="#666" domain={[0, 100]} />
              <RechartsTooltip
                contentStyle={{ backgroundColor: '#1F2937', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
              />
              <Area type="monotone" dataKey="score" stroke="#00BFA5" strokeWidth={2} fillOpacity={1} fill="url(#colorScore)" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* Recent Activity */}
        <Card spotlight className="student-summary-card">
          <div className="flex items-center gap-3 mb-6">
            <Clock className="w-6 h-6 text-teal-400" />
            <h3 className="student-summary-title">Recent Activity</h3>
          </div>
          {student.recentActivity && student.recentActivity.length > 0 ? (
            <div className="space-y-4">
              {student.recentActivity.map((activity, idx) => (
                <motion.div
                  key={activity.submissionId}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="p-4 bg-gray-900/50 rounded-lg border border-gray-800 hover:border-teal-500/50 transition-colors cursor-pointer"
                  onClick={() => navigate('/student/feedback')}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h4 className="font-semibold text-white text-sm">{activity.activityName}</h4>
                      <p className="text-xs text-gray-400 mt-1">{activity.evaluatorName}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-teal-400">{activity.score}%</div>
                      <div className="text-xs text-gray-500">
                        {new Date(activity.submittedAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  {activity.commentPreview && (
                    <p className="text-sm text-gray-300 mt-2 line-clamp-2">{activity.commentPreview}</p>
                  )}
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400 text-sm">
              No recent activity yet
            </div>
          )}
        </Card>
      </div>

      {/* AI Personalized Insights */}
      <div className="mb-8">
        <InsightsCard feedbackSummary={student.feedbackSummary} />
      </div>

      {/* My Feedback History */}
      <Card spotlight className="student-summary-card mb-8">
        <div className="student-summary-header">
          <MessageSquare className="student-summary-icon" />
          <h3 className="student-summary-title">My Feedback</h3>
        </div>
        {feedbackHistory.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
            {feedbackHistory.map((feedback, idx) => (
              <motion.div
                key={feedback.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="p-4 bg-gray-900/50 rounded-xl border border-gray-800 hover:border-teal-500/50 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {getSentimentIcon(feedback.sentimentLabel)}
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getSentimentBadgeColor(feedback.sentimentLabel)}`}>
                      {feedback.sentimentLabel || 'Neutral'}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-teal-400">{Math.round(feedback.overallScore || 0)}</div>
                    <div className="text-xs text-gray-500">Score</div>
                  </div>
                </div>
                <p className="text-gray-300 text-sm mb-3 line-clamp-3">{feedback.comment}</p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{feedback.evaluatorName || 'Anonymous Peer'}</span>
                  <span>{feedback.activityName}</span>
                </div>
                {feedback.submittedAt && (
                  <div className="text-xs text-gray-600 mt-2">
                    {new Date(feedback.submittedAt).toLocaleDateString()}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-400">
            <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No feedback received yet</p>
          </div>
        )}
      </Card>

      {/* Action Buttons */}
      <div className="student-actions">
        <Button onClick={() => setShowEvalForm(true)}>
          <Plus className="student-action-icon" />
          Submit New Evaluation
        </Button>
        <Button variant="ghost" onClick={() => navigate('/student/feedback')}>
          <FileText className="student-action-icon" />
          View Feedback History
        </Button>
      </div>

      {/* Evaluation Form Modal */}
      <AnimatePresence>
        {showEvalForm && (
          <EvaluationFormModal onClose={() => setShowEvalForm(false)} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default StudentDashboard;

