// frontend/src/services/api.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth Services
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getMe: () => api.get('/auth/me'),
};

// Team Services
export const teamAPI = {
  getAll: () => api.get('/teams'),
  getById: (id) => api.get(`/teams/${id}`),
  create: (teamData) => api.post('/teams', teamData),
  update: (id, teamData) => api.put(`/teams/${id}`, teamData),
  delete: (id) => api.delete(`/teams/${id}`),
  getTopScorers: () => api.get('/teams/stats/top-scorers'),
};

// Match Services
export const matchAPI = {
  getAll: () => api.get('/matches'),
  getById: (id) => api.get(`/matches/${id}`),
  generateBracket: () => api.post('/matches/generate-bracket'),
  simulate: (id) => api.post(`/matches/${id}/simulate`),
  reset: () => api.post('/matches/reset'),
};

export default api;