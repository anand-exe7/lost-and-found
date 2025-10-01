import axios from 'axios';

// Ensure this is the correct URL for your backend server
const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
});

// Add a request interceptor to include the token in headers
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});


// --- FIX IS HERE ---
// This function now correctly fetches items by type (e.g., 'lost' or 'found')
export const getItems = (type) => {
  // We use the '/items' endpoint and pass 'type' as a query parameter.
  // Axios will correctly format the URL to /items?type=lost
  return api.get('/items', { params: { type } });
};

// This function adds a new item
export const addItem = (itemData) => {
  // Note: For file uploads, you'd need to use FormData.
  // This example assumes JSON data.
  return api.post('/items', itemData);
};

// Example login function (you likely have this already)
export const login = (credentials) => {
  return api.post('/auth/login', credentials);
};

// Example signup function
export const signup = (userData) => {
    return api.post('/auth/signup', userData);
};

export default api;