import axios from 'axios';
import { useAuthStore } from '../../store/useAuthStore';
import { API_BASE_URL } from '../config/constants';

export const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request
axiosClient.interceptors.request.use((config) => {
  const publicEndpoints = ['/auth/login', '/auth/signup', '/auth/verify-otp', '/auth/forgot-password', '/auth/reset-password'];
  const isPublicEndpoint = publicEndpoints.some((endpoint) => config.url?.includes(endpoint));

  if (!isPublicEndpoint) {
    const token = useAuthStore.getState().token;
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Auto-refresh token on 401 Unauthorized
axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const isAuthRequest = originalRequest?.url?.includes('/auth/');

    if (error.response?.status === 401 && originalRequest && !originalRequest._retry && !isAuthRequest) {
      originalRequest._retry = true;
      try {
        const refreshToken = useAuthStore.getState().refreshToken;
        if (!refreshToken) throw new Error('No refresh token');

        const { data } = await axios.post(
          `${API_BASE_URL}/auth/refresh-token`,
          {},
          { headers: { Authorization: `Bearer ${refreshToken}` } }
        );

        const newToken = data.token || data.access_token || data.accessToken;
        if (newToken) {
          useAuthStore.getState().setToken(newToken);
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return axiosClient(originalRequest);
        }
      } catch {
        useAuthStore.getState().logout();
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);
