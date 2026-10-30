import axios from 'axios';

// Base Axios instance configured for DevScribe backend API
const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Request interceptor: attach bearer token to Authorization header if present
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default API;
