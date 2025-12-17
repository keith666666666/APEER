import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { LogOut, Plus, Users, BarChart3, CheckCircle2, AlertTriangle, TrendingUp } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { mockData } from '../services/mockData';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { CreateActivityModal } from '../components/teacher/CreateActivityModal';

// ============================================================================
// TEACHER DASHBOARD
// ============================================================================
const TeacherDashboard = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [showCreateActivity, setShowCreateActivity] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="teacher-dashboard">
      {/* Header */}
      <div className="teacher-header">
        <div>
          <h1 className="teacher-header-title">{mockData.classData.name}</h1>
          <p className="teacher-header-subtitle">{mockData.classData.totalStudents} students enrolled</p>
        </div>
        <div className="teacher-header-actions">
          <Button onClick={() => setShowCreateActivity(true)}>
            <Plus className="teacher-action-icon" />
            Create Activity
          </Button>
          <Button variant="ghost" onClick={handleLogout}>
            <LogOut className="teacher-action-icon" />
            Logout
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="teacher-stats-grid">
        <Card spotlight>
          <Users className="teacher-stat-icon teacher-stat-icon-teal" />
          <div className="teacher-stat-value">{mockData.classData.totalStudents}</div>
          <div className="teacher-stat-label">Total Students</div>
        </Card>
        <Card spotlight>
          <TrendingUp className="teacher-stat-icon teacher-stat-icon-purple" />
          <div className="teacher-stat-value">{mockData.classData.averageScore}</div>
          <div className="teacher-stat-label">Class Average</div>
        </Card>
        <Card spotlight>
          <CheckCircle2 className="teacher-stat-icon teacher-stat-icon-green" />
          <div className="teacher-stat-value">{mockData.classData.submissionRate}%</div>
          <div className="teacher-stat-label">Submission Rate</div>
        </Card>
        <Card spotlight>
          <AlertTriangle className="teacher-stat-icon teacher-stat-icon-red" />
          <div className="teacher-stat-value">{mockData.classData.biasFlags}</div>
          <div className="teacher-stat-label">Bias Flags</div>
        </Card>
      </div>

      {/* Class Overview Table */}
      <Card spotlight className="teacher-table-card">
        <h3 className="teacher-table-title">Student Overview</h3>
        <div className="teacher-table-wrapper">
          <table className="teacher-table">
            <thead>
              <tr className="teacher-table-header">
                <th className="teacher-table-header-cell">Student</th>
                <th className="teacher-table-header-cell">Score</th>
                <th className="teacher-table-header-cell">Evaluations</th>
                <th className="teacher-table-header-cell">Quality</th>
                <th className="teacher-table-header-cell">Status</th>
              </tr>
            </thead>
            <tbody>
              {mockData.students.map((student, idx) => (
                <motion.tr
                  key={student.id}
                  className={`teacher-table-row ${student.isBiased ? 'bg-red-500/5' : ''}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  whileHover={{ x: 4 }}
                >
                  <td className="teacher-table-cell">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-purple-600" />
                      <div>
                        <div className="font-semibold">{student.name}</div>
                        <div className="text-sm text-gray-500">{student.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="teacher-table-cell">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold">{student.overallScore}</span>
                      {student.isBiased && (
                        <motion.div
                          className="relative group"
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          <AlertTriangle className="w-5 h-5 text-red-400 cursor-help" />
                          <div className="absolute left-8 top-0 bg-gray-900 border border-red-500/50 rounded-lg p-3 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                            <p className="text-sm text-red-300">Score Deviation: {student.biasScore}</p>
                            <p className="text-xs text-gray-400">Anomalous Grading Detected</p>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </td>
                  <td className="teacher-table-cell">
                    <span className="text-gray-300">{student.evaluationsGiven} / {student.evaluationsReceived}</span>
                  </td>
                  <td className="teacher-table-cell">
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-gray-800 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-gradient-to-r from-teal-500 to-purple-600"
                          initial={{ width: 0 }}
                          animate={{ width: `${student.feedbackQuality}%` }}
                          transition={{ duration: 1, delay: idx * 0.1 }}
                        />
                      </div>
                      <span className="text-sm text-gray-400">{student.feedbackQuality}%</span>
                    </div>
                  </td>
                  <td className="teacher-table-cell">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      student.isBiased
                        ? 'bg-red-500/20 text-red-300'
                        : 'bg-teal-500/20 text-teal-300'
                    }`}>
                      {student.isBiased ? 'Flagged' : 'Active'}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Create Activity Modal */}
      <AnimatePresence>
        {showCreateActivity && (
          <CreateActivityModal onClose={() => setShowCreateActivity(false)} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default TeacherDashboard;

