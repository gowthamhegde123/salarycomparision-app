import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  withCredentials: true
});

export const salaryAPI = {
  getAll: (params) => api.get('/salaries', { params }),
  getById: (id) => api.get(`/salaries/${id}`),
  create: (data) => api.post('/salaries', data),
  search: (q) => api.get('/salaries/search', { params: { q } }),
  compare: (jobs) => api.get('/salaries/compare', { params: { jobs: jobs.join(',') } })
};

export const statsAPI = {
  getOverview: () => api.get('/stats/overview')
};

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  me: () => api.get('/auth/me')
};

export default api;
