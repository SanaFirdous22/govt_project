import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth headers if needed
api.interceptors.request.use(
  (config) => {
    // Add any auth headers here if needed in the future
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
    // Handle common errors
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;

      if (status === 429) {
        console.warn('Rate limit exceeded, please try again later');
      } else if (status >= 500) {
        console.error('Server error:', data);
      }

      // Return a more user-friendly error
      throw new Error(data.error || `Server error: ${status}`);
    } else if (error.request) {
      // Network error
      console.error('Network error:', error.message);
      throw new Error('Network error - please check your connection');
    } else {
      // Other error
      console.error('Request error:', error.message);
      throw new Error(error.message);
    }
  }
);

// API methods
export const apiMethods = {
  // Health check
  getHealth: () => api.get('/health'),

  // Districts
  getDistricts: () => api.get('/districts'),
  getDistrictData: (district) => api.get(`/districts/${encodeURIComponent(district)}`),
  getDistrictComparison: (district) => api.get(`/districts/${encodeURIComponent(district)}/compare`),

  // Geolocation
  reverseGeocode: (lat, lng) => api.post('/geo/reverse', { lat, lng }),
};

export { api };
export default apiMethods;
