import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { LogOut, Plus, Users, BarChart3, CheckCircle2, AlertTriangle, TrendingUp, AlertCircle, FileText, Edit, Download, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { dashboardService } from '../services/dashboardService';
import { activityService } from '../services/activityService';
import { groupService } from '../services/groupService';
import { profileService } from '../services/profileService';
import { mockData } from '../services/mockData';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { CreateActivityModal } from '../components/teacher/CreateActivityModal';
import { CreateGroupModal } from '../components/teacher/CreateGroupModal';

const TeacherDashboard = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [showCreateActivity, setShowCreateActivity] = useState(false);
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [classData, setClassData] = useState(null);
  const [students, setStudents] = useState([]);
  const [activities, setActivities] = useState([]);
  const [groups, setGroups] = useState([]);
  const [ungroupedStudents, setUngroupedStudents] = useState([]);
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const [analytics, studentList, activityList, groupList, ungroupedList, profileData] = await Promise.all([
        dashboardService.getClassAnalytics(),
        dashboardService.getStudentList(),
        activityService.getAllActivities(),
        groupService.getAllGroups(),
        dashboardService.getUngroupedStudents().catch(() => []),
        profileService.getProfile().catch(() => null)
      ]);
      setClassData(analytics);
      setStudents(studentList);
      setActivities(activityList);
      setGroups(groupList);
      setProfile(profileData);
      setUngroupedStudents(ungroupedList);
    } catch (err) {
      console.error('Error fetching teacher dashboard:', err);
      setError('Failed to load dashboard data. Using mock data.');
      setClassData(mockData.classData);
      setStudents(mockData.students);
      setActivities(mockData.activities || []);
      setGroups([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleExportCSV = async (activityId) => {
    try {
      await activityService.exportActivityCSV(activityId);
    } catch (err) {
      alert('Failed to export CSV. Please try again.');
    }
  };

  const handleCreateGroup = async (name) => {
    try {
      await groupService.createGroup(name, []);
      await fetchDashboardData(); // Refresh
    } catch (err) {
      throw err; // Let modal handle error
    }
  };

  const handleMoveToGroup = async (studentId, groupId) => {
    try {
      await groupService.assignStudentToGroup(groupId, studentId);
      await fetchDashboardData(); // Refresh
    } catch (err) {
      alert('Failed to move student to group. Please try again.');
    }
  };

  const handleRemoveFromGroup = async (studentId, groupId) => {
    try {
      await groupService.removeStudentFromGroup(groupId, studentId);
      await fetchDashboardData(); // Refresh
    } catch (err) {
      alert('Failed to remove student from group. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="teacher-dashboard flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const displayData = classData || mockData.classData;
  const displayStudents = students.length > 0 ? students : mockData.students;

  return (
    <div className="teacher-dashboard">
      {error && (
        <div className="mb-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-xl flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-yellow-400" />
          <p className="text-yellow-400 text-sm">{error}</p>
        </div>
      )}
      
      {/* Header */}
      <div className="teacher-header">
        <div>
          <h1 className="teacher-header-title">{displayData.name || 'Class Overview'}</h1>
          <p className="teacher-header-subtitle">{displayData.totalStudents || 0} students enrolled</p>
        </div>
        <div className="teacher-header-actions">
          <Button onClick={() => setShowCreateActivity(true)}>
            <Plus className="teacher-action-icon" />
            Create Activity
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
            <LogOut className="teacher-action-icon" />
            Logout
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-800">
        {[
          { id: 'overview', label: 'Overview', icon: BarChart3 },
          { id: 'activities', label: 'Activities', icon: FileText },
          { id: 'groups', label: 'Groups', icon: Users }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 font-medium transition-colors ${
                activeTab === tab.id
                  ? 'text-teal-400 border-b-2 border-teal-400'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              <Icon className="w-5 h-5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'overview' && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {/* Stats Grid */}
            <div className="teacher-stats-grid mb-8">
              <Card spotlight>
                <Users className="teacher-stat-icon teacher-stat-icon-teal" />
                <div className="teacher-stat-value">{displayData.totalStudents || 0}</div>
                <div className="teacher-stat-label">Total Students</div>
              </Card>
              <Card spotlight>
                <TrendingUp className="teacher-stat-icon teacher-stat-icon-purple" />
                <div className="teacher-stat-value">{displayData.averageScore || 0}</div>
                <div className="teacher-stat-label">Class Average</div>
              </Card>
              <Card spotlight>
                <CheckCircle2 className="teacher-stat-icon teacher-stat-icon-green" />
                <div className="teacher-stat-value">{displayData.submissionRate || 0}%</div>
                <div className="teacher-stat-label">Submission Rate</div>
              </Card>
              <Card spotlight>
                <AlertTriangle className="teacher-stat-icon teacher-stat-icon-red" />
                <div className="teacher-stat-value">{displayData.biasFlags || 0}</div>
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
                    {displayStudents.map((student, idx) => (
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
                              <AlertTriangle className="w-5 h-5 text-red-400" />
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
          </motion.div>
        )}

        {activeTab === 'activities' && (
          <motion.div
            key="activities"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card spotlight>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold">All Activities</h3>
                <Button onClick={() => setShowCreateActivity(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  New Activity
                </Button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-800">
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Name</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Status</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Deadline</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Submissions</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Participants</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activities.map((activity, idx) => (
                      <motion.tr
                        key={activity.id}
                        className="border-b border-gray-800/50 hover:bg-gray-900/50 transition-colors"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                      >
                        <td className="py-4 px-4">
                          <div className="font-semibold">{activity.name}</div>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            activity.status === 'active'
                              ? 'bg-teal-500/20 text-teal-300'
                              : 'bg-gray-500/20 text-gray-300'
                          }`}>
                            {activity.status || 'active'}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-gray-400">
                          {activity.dueDate ? new Date(activity.dueDate).toLocaleDateString() : 'N/A'}
                        </td>
                        <td className="py-4 px-4">
                          {activity.submissionCount || 0} / {activity.totalParticipants || activity.participants || 0}
                        </td>
                        <td className="py-4 px-4 text-gray-400">
                          {activity.totalParticipants || activity.participants || 0}
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              className="p-2"
                              onClick={() => handleExportCSV(activity.id)}
                              title="Export CSV"
                            >
                              <Download className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              className="p-2"
                              title="View Details"
                            >
                              <FileText className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              className="p-2"
                              title="Edit"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
                {activities.length === 0 && (
                  <div className="text-center py-12 text-gray-400">
                    No activities yet. Create your first activity!
                  </div>
                )}
              </div>
            </Card>
          </motion.div>
        )}

        {activeTab === 'groups' && (
          <motion.div
            key="groups"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Ungrouped Students */}
              <Card spotlight>
                <h3 className="text-xl font-bold mb-4">Ungrouped Students</h3>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {ungroupedStudents.map((student) => (
                    <div
                      key={student.id}
                      className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg hover:bg-gray-900 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-500 to-purple-600" />
                        <div>
                          <div className="font-medium">{student.name}</div>
                          <div className="text-sm text-gray-500">{student.email}</div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {groups.map((group) => (
                          <Button
                            key={group.id}
                            variant="ghost"
                            className="text-xs px-2 py-1"
                            onClick={() => handleMoveToGroup(student.id, group.id)}
                          >
                            → {group.name}
                          </Button>
                        ))}
                      </div>
                    </div>
                  ))}
                  {ungroupedStudents.length === 0 && (
                    <div className="text-center py-8 text-gray-400 text-sm">
                      All students are grouped
                    </div>
                  )}
                </div>
              </Card>

              {/* Groups */}
              <Card spotlight>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold">Groups</h3>
                  <Button
                    variant="ghost"
                    onClick={() => setShowCreateGroup(true)}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    New Group
                  </Button>
                </div>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {groups.map((group) => (
                    <div
                      key={group.id}
                      className="p-4 bg-gray-900/50 rounded-lg"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold">{group.name}</h4>
                        <span className="text-sm text-gray-400">{group.memberCount || 0} members</span>
                      </div>
                      <div className="space-y-2">
                        {group.members?.map((member) => (
                          <div
                            key={member.id}
                            className="flex items-center justify-between p-2 bg-gray-800/50 rounded"
                          >
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-teal-500 to-purple-600" />
                              <span className="text-sm">{member.name}</span>
                            </div>
                            <Button
                              variant="ghost"
                              className="p-1"
                              onClick={() => handleRemoveFromGroup(member.id, group.id)}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                        {(!group.members || group.members.length === 0) && (
                          <div className="text-center py-4 text-gray-400 text-sm">
                            No members
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  {groups.length === 0 && (
                    <div className="text-center py-8 text-gray-400 text-sm">
                      No groups yet. Create your first group!
                    </div>
                  )}
                </div>
              </Card>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Create Activity Modal */}
      <AnimatePresence>
        {showCreateActivity && (
          <CreateActivityModal
            onClose={() => setShowCreateActivity(false)}
            onActivityCreated={() => {
              setShowCreateActivity(false);
              fetchDashboardData();
            }}
          />
        )}
      </AnimatePresence>

      {/* Create Group Modal */}
      <AnimatePresence>
        {showCreateGroup && (
          <CreateGroupModal
            onClose={() => setShowCreateGroup(false)}
            onCreate={handleCreateGroup}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default TeacherDashboard;
