import api, { setAuthToken } from './api';

// ============================================================================
// AUTH SERVICE
// ============================================================================

const USE_MOCK = import.meta.env.VITE_USE_MOCK_DATA === 'true';

export const authService = {
  /**
   * Check if backend is reachable
   */
  async checkBackendHealth() {
    try {
      await api.get('/auth/health', { timeout: 3000 });
      return true;
    } catch (error) {
      return false;
    }
  },

  /**
   * Login with Google ID Token
   */
  async loginWithGoogle(googleCredential) {
    if (USE_MOCK) {
      // Mock login for development
      const userData = { 
        email: 'mock@university.edu', 
        role: 'student', 
        name: 'Mock User',
        token: 'mock_token_' + Date.now()
      };
      setAuthToken(userData.token);
      localStorage.setItem('apeer_user', JSON.stringify(userData));
      return userData;
    }

    try {
      // First check if backend is reachable
      const isBackendReady = await this.checkBackendHealth();
      if (!isBackendReady) {
        const error = new Error('Backend server is not running. Please start the Spring Boot backend on port 8080.');
        error.code = 'ERR_BACKEND_OFFLINE';
        throw error;
      }

      const response = await api.post('/auth/google', { token: googleCredential });
      const { token, email: userEmail, name, role } = response.data;
      
      setAuthToken(token);
      
      const userData = {
        email: userEmail,
        name,
        role: role.toLowerCase(),
        token
      };
      
      localStorage.setItem('apeer_user', JSON.stringify(userData));
      
      return userData;
    } catch (error) {
      console.error('Google login error:', error);
      
      // Enhance error message
      if (error.code === 'ERR_NETWORK' || error.code === 'ERR_BACKEND_OFFLINE' || error.message?.includes('ERR_CONNECTION_REFUSED')) {
        error.message = 'Cannot connect to server. Please ensure the backend is running on http://localhost:8080';
      } else if (error.response?.status === 403) {
        error.message = 'Access forbidden. Please check your Google OAuth configuration in Google Cloud Console.';
      } else if (error.response?.status === 401) {
        error.message = 'Invalid Google token. Please try signing in again.';
      } else if (error.response?.data?.message) {
        error.message = error.response.data.message;
      }
      
      throw error;
    }
  },

  /**
   * Login with email (for development/fallback)
   * Note: This is a fallback method. For production, use loginWithGoogle
   */
  async login(email) {
    if (USE_MOCK) {
      // Mock login
      let role = 'student';
      if (email.includes('teacher')) role = 'teacher';
      if (email.includes('admin')) role = 'admin';
      
      const userData = { 
        email, 
        role, 
        name: email.split('@')[0].replace('.', ' '),
        token: 'mock_token_' + Date.now()
      };
      setAuthToken(userData.token);
      localStorage.setItem('apeer_user', JSON.stringify(userData));
      return userData;
    }

    try {
      // For development: treat email as a simple identifier
      // In production, this should use Google OAuth
      // For now, we'll use the Google endpoint with email as token (backend handles this)
      const response = await api.post('/auth/google', { token: email });
      const { token, email: userEmail, name, role } = response.data;
      
      setAuthToken(token);
      
      const userData = {
        email: userEmail,
        name,
        role: role.toLowerCase(),
        token
      };
      
      localStorage.setItem('apeer_user', JSON.stringify(userData));
      
      return userData;
    } catch (error) {
      console.error('Login error:', error);
      
      // Enhance error message
      if (error.code === 'ERR_NETWORK' || error.message?.includes('ERR_CONNECTION_REFUSED')) {
        error.message = 'Cannot connect to server. Please ensure the backend is running on http://localhost:8080';
      }
      
      throw error;
    }
  },

  /**
   * Register new user
   */
  async register(email, name, role) {
    if (USE_MOCK) {
      const userData = { email, role, name, token: 'mock_token_' + Date.now() };
      setAuthToken(userData.token);
      localStorage.setItem('apeer_user', JSON.stringify(userData));
      return userData;
    }

    try {
      // Check if backend is reachable
      const isBackendReady = await this.checkBackendHealth();
      if (!isBackendReady) {
        const error = new Error('Backend server is not running. Please start the Spring Boot backend on port 8080.');
        error.code = 'ERR_BACKEND_OFFLINE';
        throw error;
      }

      const response = await api.post('/auth/register', {
        email,
        name,
        role
      });
      
      const { token, email: userEmail, name: userName, role: userRole } = response.data;
      
      setAuthToken(token);
      
      const userData = {
        email: userEmail,
        name: userName,
        role: userRole.toLowerCase(),
        token
      };
      
      localStorage.setItem('apeer_user', JSON.stringify(userData));
      
      return userData;
    } catch (error) {
      console.error('Registration error:', error);
      
      // Enhance error message
      if (error.code === 'ERR_NETWORK' || error.code === 'ERR_BACKEND_OFFLINE' || error.message?.includes('ERR_CONNECTION_REFUSED')) {
        error.message = 'Cannot connect to server. Please ensure the backend is running on http://localhost:8080';
      } else if (error.response?.status === 409) {
        error.message = 'User with this email already exists. Please try logging in instead.';
      } else if (error.response?.status === 400) {
        error.message = error.response.data?.message || 'Invalid registration data. Please check your input.';
      } else if (error.response?.data?.message) {
        error.message = error.response.data.message;
      }
      
      throw error;
    }
  },

  /**
   * Logout
   */
  logout() {
    setAuthToken(null);
    localStorage.removeItem('apeer_user');
  }
};

