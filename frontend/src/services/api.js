import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:9009', // Changed port to 9009
  withCredentials: true,
});

// Authentication Endpoints
export const login = (credentials) => 
  api.post('/api/auth/login', credentials)
    .then(response => {
      // Store token in axios defaults for subsequent requests
      if (response.data.token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
      }
      return response.data;
    });

export const logout = () => {
  delete api.defaults.headers.common['Authorization'];
  return api.post('/api/auth/logout');
};

export const getCurrentUser = () => 
  api.get('/api/auth/me').then(response => response.data);

// Product Endpoints (existing)
export const createProduct = (formData) =>
  api.post('/api/products', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export const updateProduct = (id, formData) =>
  api.put(`/api/products/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export const getProductById = (id) =>
  api.get(`/api/products/${id}`).then((response) => response.data);

// Add interceptors for error handling
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Handle unauthorized errors (e.g., redirect to login)
      console.error('Authentication error', error);
    }
    return Promise.reject(error);
  }
);

// Initialize auth token if exists
const token = localStorage.getItem('token');
if (token) {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

export default api;