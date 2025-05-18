import axios from 'axios';

// Create an axios instance with default config
const API_URL = import.meta.env.VITE_API_URL || 'https://pomodorify-rsld.onrender.com/api';

console.log('API Service - Using baseURL:', API_URL);

// Configure timeout and retry logic
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// Add a request interceptor
api.interceptors.request.use(
  (config) => {
    // Get the token from localStorage if it exists
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Log request for debugging in development
    if (process.env.NODE_ENV !== 'production') {
      console.log(`API Request: ${config.method.toUpperCase()} ${config.url}`);
    }
    
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Add a response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    // Handle network errors
    if (!error.response) {
      console.error('Network Error - Unable to connect to the server');
      return Promise.reject({
        message: 'Unable to connect to the server. Please check your internet connection.',
        isNetworkError: true
      });
    }
    
    // Handle 401 Unauthorized errors
    if (error.response && error.response.status === 401) {
      console.log('Unauthorized request - clearing token');
      // Clear token and redirect to login if not already on login page
      localStorage.removeItem('token');
      if (window.location.pathname !== '/login' && window.location.pathname !== '/signup') {
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

export default api; 