import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { LogOut, AlertCircle, RefreshCw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { adminService } from '../services/adminService';
import { profileService } from '../services/profileService';
import { mockData } from '../services/mockData';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

// ============================================================================
// ADMIN DASHBOARD
// ============================================================================
const AdminDashboard = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUsers();
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const profileData = await profileService.getProfile();
      setProfile(profileData);
    } catch (err) {
      console.error('Error fetching profile:', err);
    }
  };

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const userList = await adminService.getAllUsers();
      setUsers(userList);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to load users. Using mock data.');
      // Fallback to mock data
      setUsers(mockData.users);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleUserStatus = async (userId) => {
    try {
      const currentUser = users.find(u => u.id === userId);
      if (!currentUser) return;

      const newStatus = currentUser.status === 'Active' ? 'Suspended' : 'Active';
      await adminService.updateUserStatus(userId, newStatus);
      
      // Refresh user list
      await fetchUsers();
    } catch (err) {
      console.error('Error updating user status:', err);
      alert('Failed to update user status. Please try again.');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (isLoading) {
    return (
      <div className="admin-dashboard flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <div className="admin-header">
        <div>
          <h1 className="admin-header-title">Admin Dashboard</h1>
          <p className="admin-header-subtitle">System User Management</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" onClick={fetchUsers}>
            <RefreshCw className="admin-action-icon" />
            Refresh
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
            <LogOut className="admin-action-icon" />
            Logout
          </Button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-xl flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-yellow-400" />
          <p className="text-yellow-400 text-sm">{error}</p>
        </div>
      )}

      {/* User Table */}
      <Card spotlight>
        <h3 className="admin-table-title">Registered Users</h3>
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr className="admin-table-header">
                <th className="admin-table-header-cell">Name</th>
                <th className="admin-table-header-cell">Email</th>
                <th className="admin-table-header-cell">Role</th>
                <th className="admin-table-header-cell">Status</th>
                <th className="admin-table-header-cell">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <motion.tr
                  key={user.id}
                  className="admin-table-row"
                  whileHover={{ x: 4 }}
                >
                  <td className="admin-table-cell">{user.name}</td>
                  <td className="admin-table-cell admin-table-cell-email">{user.email}</td>
                  <td className="admin-table-cell">
                    <span className={`admin-role-badge ${
                      user.role === 'Teacher' 
                        ? 'admin-role-badge-teacher'
                        : 'admin-role-badge-student'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="admin-table-cell">
                    <span className={`admin-status-badge ${
                      user.status === 'Active'
                        ? 'admin-status-badge-active'
                        : 'admin-status-badge-suspended'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="admin-table-cell">
                    <Button
                      variant={user.status === 'Active' ? 'danger' : 'secondary'}
                      className="admin-action-button"
                      onClick={() => toggleUserStatus(user.id)}
                    >
                      {user.status === 'Active' ? 'Suspend' : 'Activate'}
                    </Button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default AdminDashboard;

