import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { mockData } from '../services/mockData';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

// ============================================================================
// ADMIN DASHBOARD
// ============================================================================
const AdminDashboard = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState(mockData.users);

  const toggleUserStatus = (userId) => {
    setUsers(users.map(u => 
      u.id === userId 
        ? { ...u, status: u.status === 'Active' ? 'Suspended' : 'Active' }
        : u
    ));
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <div className="admin-header">
        <div>
          <h1 className="admin-header-title">Admin Dashboard</h1>
          <p className="admin-header-subtitle">System User Management</p>
        </div>
        <Button variant="ghost" onClick={handleLogout}>
          <LogOut className="admin-action-icon" />
          Logout
        </Button>
      </div>

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

