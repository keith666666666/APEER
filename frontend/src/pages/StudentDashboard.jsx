import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { LogOut, TrendingUp, Plus, FileText, Sparkles, CheckCircle2, Target, Zap, Award, Clock } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import { useAuth } from '../context/AuthContext';
import { mockData } from '../services/mockData';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { EvaluationFormModal } from '../components/student/EvaluationFormModal';

// ============================================================================
// STUDENT DASHBOARD
// ============================================================================
const StudentDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const student = mockData.students[0];
  const [showEvalForm, setShowEvalForm] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="student-dashboard">
      {/* Header */}
      <div className="student-header">
        <div>
          <h1 className="student-header-title">Welcome back, {student.name}</h1>
          <p className="student-header-subtitle">Your evaluation dashboard</p>
        </div>
        <Button variant="ghost" onClick={handleLogout}>
          <LogOut className="student-action-icon" />
          Logout
        </Button>
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

      {/* Performance Trend Chart */}
      <Card spotlight className="student-summary-card mb-8">
        <h3 className="student-summary-title mb-6">Performance Trend</h3>
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={student.sentimentTrend}>
            <defs>
              <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00BFA5" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#00BFA5" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="week" stroke="#666" />
            <YAxis stroke="#666" />
            <RechartsTooltip
              contentStyle={{ backgroundColor: '#1F2937', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
            />
            <Area type="monotone" dataKey="score" stroke="#00BFA5" strokeWidth={2} fillOpacity={1} fill="url(#colorScore)" />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      {/* Feedback Summary */}
      <Card spotlight className="student-summary-card">
        <div className="student-summary-header">
          <Sparkles className="student-summary-icon" />
          <h3 className="student-summary-title">AI-Generated Summary</h3>
        </div>
        <div className="student-summary-grid">
          <div>
            <h4 className="student-summary-section-title student-summary-section-title-teal">
              <CheckCircle2 className="student-summary-icon-small" />
              Strengths
            </h4>
            <p className="student-summary-text">{student.feedbackSummary.strengths}</p>
          </div>
          <div>
            <h4 className="student-summary-section-title student-summary-section-title-yellow">
              <Target className="student-summary-icon-small" />
              Areas for Growth
            </h4>
            <p className="student-summary-text">{student.feedbackSummary.weaknesses}</p>
          </div>
          <div>
            <h4 className="student-summary-section-title student-summary-section-title-purple">
              <Zap className="student-summary-icon-small" />
              Key Themes
            </h4>
            <div className="student-summary-themes">
              {student.feedbackSummary.themes.map((theme, i) => (
                <span key={i} className="student-summary-theme">
                  {theme}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="student-actions">
        <Button onClick={() => setShowEvalForm(true)}>
          <Plus className="student-action-icon" />
          Submit New Evaluation
        </Button>
        <Button variant="ghost">
          <FileText className="student-action-icon" />
          View History
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

