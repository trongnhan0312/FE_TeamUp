// src/services/axiosConfig.js
import axios from 'axios';
import { getToken, isTokenValid, logout } from '../utils/auth';
import { API_URL, API_CONFIG } from './apiConfig';

const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Thêm interceptor cho request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token && isTokenValid()) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    // Thêm logging trong môi trường development
    if (process.env.REACT_APP_ENV === 'development') {
      console.log('Request:', config);
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Thêm interceptor cho response
axiosInstance.interceptors.response.use(
  (response) => {
    // Logging trong môi trường development
    if (process.env.REACT_APP_ENV === 'development') {
      console.log('Response:', response.data);
    }
    return response;
  },
  (error) => {
    // Logging trong môi trường development
    if (process.env.REACT_APP_ENV === 'development') {
      console.error('Response Error:', error.response);
    }
    
    // Xử lý lỗi 401 (Unauthorized)
    if (error.response && error.response.status === 401) {
      logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;