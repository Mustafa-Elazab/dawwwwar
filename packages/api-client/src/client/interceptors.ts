import { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { tokenManager } from './token-manager';
import { idempotencyManager } from '../core/idempotency/IdempotencyManager';

const NON_RETRYABLE_URLS = [
  '/orders',
  '/orders/custom',
  '/wallet/recharge',
  '/wallet/recharge/paymob',
];

export const setupInterceptors = (
  instance: AxiosInstance,
  options?: {
    onUnauthorized?: () => void;
    debug?: boolean;
  }
) => {
  // ─── Request Interceptor ───────────────────────────────────────────
  instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      // 1. Handle Auth Token
      const token = tokenManager.accessToken;
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      // 2. Handle Idempotency
      const idKey = idempotencyManager.getOrCreateKey(
        config.url || '',
        config.method || '',
        config.data
      );
      if (idKey && config.headers) {
        config.headers['x-idempotency-key'] = idKey;
      }

      if (options?.debug) {
        console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`, config.data);
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // ─── Response Interceptor ──────────────────────────────────────────
  let isRefreshing = false;
  let refreshSubscribers: ((token: string) => void)[] = [];

  const subscribeTokenRefresh = (cb: (token: string) => void) => {
    refreshSubscribers.push(cb);
  };

  const onTokenRefreshed = (token: string) => {
    refreshSubscribers.map((cb) => cb(token));
    refreshSubscribers = [];
  };

  instance.interceptors.response.use(
    (response: AxiosResponse) => {
      // Success -> Clear idempotency key
      idempotencyManager.clearKey(
        response.config.url || '', 
        response.config.method || '',
        response.config.data
      );

      if (options?.debug) {
        console.log(`[API Response] ${response.config.method?.toUpperCase()} ${response.config.url} [${response.status}]`, response.data);
      }

      // 3. Automatically unwrap { success, data } responses
      if (
        response.data &&
        typeof response.data === 'object' &&
        'success' in response.data &&
        'data' in response.data
      ) {
        return {
          ...response,
          data: response.data.data,
        };
      }

      return response;
    },
    async (error) => {
      const originalRequest = error.config;

      // 409 Conflict can be returned by our Idempotency Interceptor if already processing
      if (error.response?.status === 409) {
        return Promise.reject(error);
      }

      // If it's a confirmed success duplicate from backend, we might want to clear it too.
      // But usually, backend returns 200/201 with the cached data, so it hits the success handler above.

      // Token Refresh Logic
      if (error.response?.status === 401 && !originalRequest._retry) {
        if (isRefreshing) {
          return new Promise((resolve) => {
            subscribeTokenRefresh((token: string) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              resolve(instance(originalRequest));
            });
          });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          const refreshToken = tokenManager.refreshToken;
          if (!refreshToken) throw new Error('No refresh token');

          const { data } = await instance.post('/auth/refresh', { refreshToken });
          const { accessToken, refreshToken: newRefreshToken } = data.data;

          tokenManager.accessToken = accessToken;
          tokenManager.refreshToken = newRefreshToken;

          isRefreshing = false;
          onTokenRefreshed(accessToken);

          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return instance(originalRequest);
        } catch (refreshError) {
          isRefreshing = false;
          tokenManager.clear();
          options?.onUnauthorized?.();
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    }
  );
};
