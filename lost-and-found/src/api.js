
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
});

// Request interceptor to add token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/auth';
    }
    return Promise.reject(error);
  }
);

// Fetch items by type (lost or found)
export const getItems = async (type) => {
  try {
    const response = await api.get('/items', { params: { type } });
    // Ensure we always return an array
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error('Error fetching items:', error);
    // Return empty array on error instead of throwing
    return [];
  }
};

// Add a new item (supports FormData for file uploads)
export const addItem = async (itemData) => {
  try {
    const response = await api.post('/items', itemData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error adding item:', error);
    throw error;
  }
};

// Get single item by ID
export const getItemById = async (id) => {
  try {
    const response = await api.get(`/items/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching item:', error);
    throw error;
  }
};

// Mark item as found
export const markItemAsFound = async (id) => {
  try {
    const response = await api.post(`/items/found/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error marking item as found:', error);
    throw error;
  }
};

// Delete item
export const deleteItem = async (id) => {
  try {
    const response = await api.delete(`/items/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting item:', error);
    throw error;
  }
};

// Login
export const login = async (credentials) => {
  try {
    const response = await api.post('/auth/login', credentials);
    return response;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

// Signup
export const signup = async (userData) => {
  try {
    const response = await api.post('/auth/signup', userData);
    return response;
  } catch (error) {
    console.error('Signup error:', error);
    throw error;
  }
};

export default api;