import type { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios';
import { NETWORK_DEFAULTS } from '../constants/network';
import { getNetworkStatus } from '../network/network-monitor';

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const isIdempotent = (method?: string) => {
  const m = (method || 'get').toLowerCase();
  return m === 'get' || m === 'head' || m === 'options';
};

const isNetworkError = (error: AxiosError) => {
  return !error.response && !!error.message;
};

export const attachLogging = (instance: AxiosInstance, enabled: boolean) => {
  if (!enabled) return;

  instance.interceptors.request.use((config) => {
    (config as any).metadata = { start: Date.now() };
    const url = `${config.baseURL ?? ''}${config.url ?? ''}`;
    console.log(`[API] -> ${config.method?.toUpperCase()} ${url}`);
    return config;
  });

  instance.interceptors.response.use(
    (response) => {
      const start = (response.config as any).metadata?.start;
      const elapsed = start ? `${Date.now() - start}ms` : 'n/a';
      const url = `${response.config.baseURL ?? ''}${response.config.url ?? ''}`;
      console.log(`[API] <- ${response.status} ${response.config.method?.toUpperCase()} ${url} (${elapsed})`);
      return response;
    },
    (error: AxiosError) => {
      const url = `${error.config?.baseURL ?? ''}${error.config?.url ?? ''}`;
      console.log(`[API] !! ${error.config?.method?.toUpperCase()} ${url} (${error.message})`);
      return Promise.reject(error);
    }
  );
};

const createTraceId = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;

export const attachTracing = (instance: AxiosInstance, enabled: boolean) => {
  if (!enabled) return;
  instance.interceptors.request.use((config) => {
    if (!config.headers) config.headers = {} as any;
    if (!('x-trace-id' in config.headers)) {
      (config.headers as any)['x-trace-id'] = createTraceId();
    }
    return config;
  });
};

export const attachRetry = (
  instance: AxiosInstance,
  options?: { retries?: number; backoffMs?: number }
) => {
  const retries = options?.retries ?? NETWORK_DEFAULTS.retryCount;
  const backoffMs = options?.backoffMs ?? NETWORK_DEFAULTS.retryBackoffMs;

  instance.interceptors.response.use(undefined, async (error: AxiosError) => {
    const config = error.config as AxiosRequestConfig & { _retryCount?: number };
    if (!config || !isIdempotent(config.method)) return Promise.reject(error);

    const network = getNetworkStatus();
    if (!network.isConnected || !network.isInternetReachable) {
      return Promise.reject(error);
    }

    const status = error.response?.status ?? 0;
    const shouldRetry = status >= 500 || isNetworkError(error);
    if (!shouldRetry) return Promise.reject(error);

    config._retryCount = (config._retryCount ?? 0) + 1;
    if (config._retryCount > retries) return Promise.reject(error);

    await sleep(backoffMs * config._retryCount);
    return instance(config);
  });
};
