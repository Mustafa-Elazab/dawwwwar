import Config from 'react-native-config';
import { Platform } from 'react-native';
import { createApiClient, setupInterceptors, tokenManager, idempotencyManager } from '@dawwar/api-client';
import { mmkvTokenStorage } from './token-storage';
import { mmkvIdempotencyStorage } from './idempotency-storage';
import { store } from '../../store';
import { logout } from '../../store/slices/auth.slice';

const getApiBaseUrl = () => {
  const envUrl = Config.API_BASE_URL ?? Config.API_URL;
  if (__DEV__) {
    const host = Config.LOCAL_IP || (Platform.OS === 'android' ? '10.0.2.2' : 'localhost');
    if (!envUrl || envUrl.includes('10.0.2.2') || envUrl.includes('localhost') || envUrl.includes('127.0.0.1')) {
      return `http://${host}:3000/api/v1`;
    }
    return envUrl;
  }
  return envUrl ?? 'https://api.dawwar.com/api/v1';
};

const API_BASE_URL = getApiBaseUrl();

// Initialize managers with app-specific storage
tokenManager.setStorage(mmkvTokenStorage);
idempotencyManager.setStorage(mmkvIdempotencyStorage);

export const api = createApiClient(API_BASE_URL);

// Setup interceptors with app-specific handlers
setupInterceptors(api, {
  onUnauthorized: () => {
    store.dispatch(logout());
  },
  debug: __DEV__,
});

export default api;
