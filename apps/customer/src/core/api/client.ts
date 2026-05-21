import { createApiClient, setupInterceptors, tokenManager, idempotencyManager } from '@dawwar/api-client';
import { mmkvTokenStorage } from './token-storage';
import { mmkvIdempotencyStorage } from './idempotency-storage';
import { store } from '../../store';
import { logout } from '../../store/slices/auth.slice';
import { resetLocationState } from '../../store/slices/location.slice';
import { appConfig } from '../config/app.config';
import { attachLogging, attachRetry, attachTracing } from './interceptors';

const API_BASE_URL = appConfig.api.baseUrl;

// Initialize managers with app-specific storage
tokenManager.setStorage(mmkvTokenStorage);
idempotencyManager.setStorage(mmkvIdempotencyStorage);

export const api = createApiClient(API_BASE_URL);
export const publicApi = createApiClient(API_BASE_URL);

api.defaults.timeout = appConfig.api.timeoutMs;
publicApi.defaults.timeout = appConfig.api.timeoutMs;

// Setup interceptors for authenticated API (includes token management)
setupInterceptors(api, {
  onUnauthorized: () => {
    store.dispatch(logout());
    store.dispatch(resetLocationState());
  },
  debug: appConfig.api.enableLogs,
});

// Setup interceptors for public API (basic error normalization only)
setupInterceptors(publicApi, {
  debug: appConfig.api.enableLogs,
});

attachLogging(api, appConfig.api.enableLogs);
attachLogging(publicApi, appConfig.api.enableLogs);
attachTracing(api, appConfig.api.enableTracing);
attachTracing(publicApi, appConfig.api.enableTracing);
attachRetry(api);
attachRetry(publicApi);

export default api;
