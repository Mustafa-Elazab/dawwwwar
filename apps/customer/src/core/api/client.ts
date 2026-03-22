import axios, { type AxiosRequestConfig } from 'axios';
import Config from 'react-native-config';
import { storage, StorageKeys } from '../storage/mmkv';

const API_BASE_URL =
  Config.API_BASE_URL ?? 'https://api.dawwar.com/api/v1';

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15_000,
  headers: { 'Content-Type': 'application/json' },
});

// ─── Request interceptor: attach token ───────────────────
api.interceptors.request.use((config) => {
  const token = storage.getString(StorageKeys.ACCESS_TOKEN);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ─── Response interceptor: handle 401 with silent refresh ─
let isRefreshing = false;
let requestQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

api.interceptors.response.use(
  (response) => response,
  async (error: unknown) => {
    if (!axios.isAxiosError(error)) return Promise.reject(error);

    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean;
    };

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Queue this request until the refresh completes
        return new Promise((resolve, reject) => {
          requestQueue.push({ resolve, reject });
        }).then((token) => {
          if (originalRequest.headers) {
            originalRequest.headers['Authorization'] = `Bearer ${token}`;
          }
          return api(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = storage.getString(StorageKeys.REFRESH_TOKEN);
        if (!refreshToken) throw new Error('No refresh token');

        const { data } = await api.post<{
          data: { accessToken: string; refreshToken: string };
        }>('/auth/refresh', { refreshToken });

        const newAccessToken = data.data.accessToken;
        storage.set(StorageKeys.ACCESS_TOKEN, newAccessToken);
        storage.set(StorageKeys.REFRESH_TOKEN, data.data.refreshToken);

        // Resolve all queued requests
        requestQueue.forEach((p) => p.resolve(newAccessToken));
        requestQueue = [];

        if (originalRequest.headers) {
          originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        }
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed — clear tokens and force logout
        requestQueue.forEach((p) => p.reject(refreshError));
        requestQueue = [];
        storage.delete(StorageKeys.ACCESS_TOKEN);
        storage.delete(StorageKeys.REFRESH_TOKEN);

        // Import store lazily to avoid circular dependency
        const { store } = await import('../../store');
        const { logout } = await import('../../store/slices/auth.slice');
        store.dispatch(logout());

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export default api;
