import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider, useAuth } from './context/AuthContext';
import { BackendStatus } from './components/BackendStatus';
import LandingPage from './pages/LandingPage';
import StudentDashboard from './pages/StudentDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import AdminDashboard from './pages/AdminDashboard';
import ProfilePage from './pages/ProfilePage';
import MyFeedback from './pages/MyFeedback';

// Get Google Client ID from environment variable
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

// Warn if Google Client ID is not configured
if (!GOOGLE_CLIENT_ID && import.meta.env.DEV) {
  console.warn(
    '⚠️ Google OAuth Client ID not configured!\n' +
    'Please set VITE_GOOGLE_CLIENT_ID in your .env file.\n' +
    'See GOOGLE_OAUTH_SETUP.md for instructions.'
  );
}

// Protected Route Wrapper
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();
  
  if (!user) return <Navigate to="/" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role.toLowerCase())) {
    return <Navigate to="/" replace />; // Or a "Not Authorized" page
  }
  return children;
};

const AppRoutes = () => {
  return (
    <BackendStatus>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        
        <Route path="/student" element={
          <ProtectedRoute allowedRoles={['student']}>
            <StudentDashboard />
          </ProtectedRoute>
        } />

        <Route path="/student/feedback" element={
          <ProtectedRoute allowedRoles={['student']}>
            <MyFeedback />
          </ProtectedRoute>
        } />

        <Route path="/teacher" element={
          <ProtectedRoute allowedRoles={['teacher']}>
            <TeacherDashboard />
          </ProtectedRoute>
        } />

        <Route path="/admin" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        } />

        <Route path="/profile" element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        } />
      </Routes>
    </BackendStatus>
  );
};

export default function App() {
  // If Google Client ID is not configured, still render app but without Google OAuth
  if (!GOOGLE_CLIENT_ID) {
    return (
      <AuthProvider>
        <Router>
          <AppRoutes />
        </Router>
      </AuthProvider>
    );
  }

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <AuthProvider>
        <Router>
          <AppRoutes />
        </Router>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}

