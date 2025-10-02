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

// ========== NOTIFICATION APIs ==========

// Get all notifications for current user
export const getNotifications = async () => {
  try {
    const response = await api.get('/notifications');
    return response.data;
  } catch (error) {
    console.error('Error fetching notifications:', error);
    throw error;
  }
};

// Get unread notification count
export const getUnreadCount = async () => {
  try {
    const response = await api.get('/notifications/unread-count');
    return response.data;
  } catch (error) {
    console.error('Error fetching unread count:', error);
    return { count: 0 };
  }
};

// Create a found claim
export const createClaim = async (itemId, foundLocation, message) => {
  try {
    const response = await api.post('/notifications/claim', {
      itemId,
      foundLocation,
      message
    });
    return response.data;
  } catch (error) {
    console.error('Error creating claim:', error);
    throw error;
  }
};

// Approve a claim
export const approveClaim = async (notificationId) => {
  try {
    const response = await api.put(`/notifications/${notificationId}/approve`);
    return response.data;
  } catch (error) {
    console.error('Error approving claim:', error);
    throw error;
  }
};

// Reject a claim
export const rejectClaim = async (notificationId) => {
  try {
    const response = await api.put(`/notifications/${notificationId}/reject`);
    return response.data;
  } catch (error) {
    console.error('Error rejecting claim:', error);
    throw error;
  }
};

// Mark notification as read
export const markAsRead = async (notificationId) => {
  try {
    const response = await api.put(`/notifications/${notificationId}/read`);
    return response.data;
  } catch (error) {
    console.error('Error marking as read:', error);
    throw error;
  }
};

// Mark all notifications as read
export const markAllAsRead = async () => {
  try {
    const response = await api.put('/notifications/mark-all-read');
    return response.data;
  } catch (error) {
    console.error('Error marking all as read:', error);
    throw error;
  }
};

// ========== COMMENT APIs ==========

// Get comments for an item
export const getComments = async (itemId) => {
  try {
    const response = await api.get(`/comments/${itemId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching comments:', error);
    return [];
  }
};

// Add a comment
export const addComment = async (itemId, text, parentCommentId = null) => {
  try {
    const response = await api.post('/comments', {
      itemId,
      text,
      parentCommentId
    });
    return response.data;
  } catch (error) {
    console.error('Error adding comment:', error);
    throw error;
  }
};

// Delete a comment
export const deleteComment = async (commentId) => {
  try {
    const response = await api.delete(`/comments/${commentId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting comment:', error);
    throw error;
  }
};