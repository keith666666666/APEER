import axios from 'axios';

// ============================================================================
// API CONFIGURATION
// ============================================================================

// Base URL from environment variable or default
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
const AI_SERVICE_URL = import.meta.env.VITE_AI_SERVICE_URL || 'http://localhost:5000/api';

// Create Axios instance for backend API
export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Create Axios instance for AI service
export const aiApi = axios.create({
  baseURL: AI_SERVICE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('apeer_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Don't set Content-Type for FormData, let browser set it with boundary
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      // Server responded with error status
      switch (error.response.status) {
        case 401:
          // Unauthorized - clear token and redirect to login
          localStorage.removeItem('apeer_token');
          localStorage.removeItem('apeer_user');
          window.location.href = '/';
          break;
        case 403:
          console.error('Forbidden: You do not have permission to access this resource');
          break;
        case 404:
          console.error('Not Found: The requested resource was not found');
          break;
        case 500:
          console.error('Server Error: Internal server error occurred');
          break;
        default:
          console.error('API Error:', error.response.data?.message || error.message);
      }
    } else if (error.request) {
      // Request was made but no response received
      if (error.code === 'ERR_NETWORK' || error.code === 'ECONNREFUSED') {
        console.error('Network Error: Backend server is not running');
        error.message = 'Cannot connect to server. Please ensure the backend is running on http://localhost:8080';
        error.code = 'ERR_BACKEND_OFFLINE';
      } else {
        console.error('Network Error: No response from server');
      }
    } else {
      // Something else happened
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

// Helper function to set auth token
export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('apeer_token', token);
  } else {
    localStorage.removeItem('apeer_token');
  }
};

// Helper function to get auth token
export const getAuthToken = () => {
  return localStorage.getItem('apeer_token');
};

export default api;

