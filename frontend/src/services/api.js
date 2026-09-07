const API_BASE_URL = 'http://localhost:5000/api';

/**
 * Core HTTP request handler with automatic token injection
 */
async function request(endpoint, options = {}) {
  const token = localStorage.getItem('nexus_token');

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const config = {
    ...options,
    headers,
  };

  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || `Request failed with status ${res.status}`);
    }

    return data;
  } catch (error) {
    console.error(`[API Error] ${options.method || 'GET'} ${endpoint}:`, error.message);
    throw error;
  }
}

export const api = {
  // Authentication
  auth: {
    register: (userData) =>
      request('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
      }),
    login: (credentials) =>
      request('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      }),
    getMe: () => request('/auth/me'),
  },

  // Posts & Feed
  posts: {
    getAll: (page = 1, limit = 20) => request(`/posts?page=${page}&limit=${limit}`),
    getById: (id) => request(`/posts/${id}`),
    create: (postData) =>
      request('/posts', {
        method: 'POST',
        body: JSON.stringify(postData),
      }),
    delete: (id) =>
      request(`/posts/${id}`, {
        method: 'DELETE',
      }),
    toggleLike: (id) =>
      request(`/posts/${id}/like`, {
        method: 'POST',
      }),
  },

  // Comments
  comments: {
    getByPost: (postId) => request(`/posts/${postId}/comments`),
    add: (postId, text) =>
      request(`/posts/${postId}/comments`, {
        method: 'POST',
        body: JSON.stringify({ text }),
      }),
  },

  // Users & Profiles
  users: {
    getProfile: (username) => request(`/users/${username}`),
    updateProfile: (profileData) =>
      request('/users/profile', {
        method: 'PUT',
        body: JSON.stringify(profileData),
      }),
    getSuggestions: () => request('/users/suggestions'),
  },
};

export default api;
