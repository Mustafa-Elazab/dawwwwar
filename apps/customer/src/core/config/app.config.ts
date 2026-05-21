import { env } from './env';
import { getApiBaseUrl, getSocketUrl } from './api.config';

export const appConfig = {
  env: env.appEnv,
  api: {
    baseUrl: getApiBaseUrl(),
    socketUrl: getSocketUrl(),
    timeoutMs: env.apiTimeoutMs,
    enableLogs: env.enableApiLogs,
    enableTracing: env.enableApiTracing,
  },
  network: {
    allowCleartext: env.allowCleartext,
  },
  useMockApi: env.useMockApi,
};
