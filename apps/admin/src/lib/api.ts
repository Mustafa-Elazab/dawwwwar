import { createApiClient, setupInterceptors, tokenManager, TokenStorage, idempotencyManager, IdempotencyStorage } from '@dawwar/api-client';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

const browserTokenStorage: TokenStorage = {
  getAccessToken: () => typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null,
  setAccessToken: (token) => localStorage.setItem('admin_token', token),
  getRefreshToken: () => typeof window !== 'undefined' ? localStorage.getItem('admin_refresh_token') : null,
  setRefreshToken: (token) => localStorage.setItem('admin_refresh_token', token),
  clearTokens: () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_refresh_token');
  },
};

const browserIdempotencyStorage: IdempotencyStorage = {
  getItem: (key) => typeof window !== 'undefined' ? localStorage.getItem(key) : null,
  setItem: (key, value) => localStorage.setItem(key, value),
  removeItem: (key) => localStorage.removeItem(key),
};

tokenManager.setStorage(browserTokenStorage);
idempotencyManager.setStorage(browserIdempotencyStorage);

export const api = createApiClient(`${API_BASE_URL}/api/v1`);

setupInterceptors(api, {
  onUnauthorized: () => {
    window.location.href = '/login';
  },
});

export default api;
