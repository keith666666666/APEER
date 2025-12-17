import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { setAuthToken } from '../services/api';

// ============================================================================
// AUTH CONTEXT
// ============================================================================
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('apeer_user');
    const storedToken = localStorage.getItem('apeer_token');
    
    if (storedUser && storedToken) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        setAuthToken(storedToken);
      } catch (e) {
        localStorage.removeItem('apeer_user');
        localStorage.removeItem('apeer_token');
      }
    }
    setIsLoading(false);
  }, []);

  /**
   * Login with Google ID Token
   * Sends token to backend, receives JWT and user info
   */
  const loginWithGoogle = async (googleCredential) => {
    setError(null);
    setIsLoading(true);

    try {
      // Send Google ID token to backend
      const response = await authService.loginWithGoogle(googleCredential);
      
      setUser(response);
      if (response.token) {
        localStorage.setItem('apeer_token', response.token);
        setAuthToken(response.token);
      }
      setIsLoading(false);
      return { success: true, role: response.role, user: response };
    } catch (err) {
      console.error('Login failed:', err);
      
      // Enhanced error handling
      let errorMessage = 'Login failed. Please try again.';
      
      if (err.code === 'ERR_NETWORK' || err.code === 'ERR_BACKEND_OFFLINE' || err.message?.includes('ERR_CONNECTION_REFUSED')) {
        errorMessage = 'Cannot connect to server. Please ensure the backend is running on http://localhost:8080';
      } else if (err.response?.status === 403) {
        errorMessage = 'Access forbidden. Please check your Google OAuth configuration in Google Cloud Console. Make sure http://localhost:5173 and http://localhost:5174 are added to authorized origins.';
      } else if (err.response?.status === 401) {
        errorMessage = 'Invalid Google token. Please try signing in again.';
      } else if (err.message) {
        errorMessage = err.message;
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      }
      
      setError(errorMessage);
      setIsLoading(false);
      return { success: false, error: errorMessage };
    }
  };

  const login = async (email) => {
    setError(null);
    setIsLoading(true);
    try {
      const userData = await authService.login(email);
      setUser(userData);
      localStorage.setItem('apeer_user', JSON.stringify(userData));
      if (userData.token) {
        localStorage.setItem('apeer_token', userData.token);
        setAuthToken(userData.token);
      }
      setIsLoading(false);
      return userData;
    } catch (error) {
      console.error('Login failed:', error);
      setError(error.message || 'Login failed. Please try again.');
      setIsLoading(false);
      throw error;
    }
  };

  const register = async (email, name, role) => {
    setError(null);
    setIsLoading(true);
    try {
      const userData = await authService.register(email, name, role);
      setUser(userData);
      localStorage.setItem('apeer_user', JSON.stringify(userData));
      if (userData.token) {
        localStorage.setItem('apeer_token', userData.token);
        setAuthToken(userData.token);
      }
      setIsLoading(false);
      return userData;
    } catch (error) {
      console.error('Registration failed:', error);
      setError(error.message || 'Registration failed. Please try again.');
      setIsLoading(false);
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setError(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading, error, loginWithGoogle }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

