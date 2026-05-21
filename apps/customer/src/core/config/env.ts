import Config from 'react-native-config';
import { z } from 'zod';

const envSchema = z.object({
  APP_ENV: z.enum(['development', 'staging', 'production']).optional(),
  API_BASE_URL: z.string().optional(),
  SOCKET_URL: z.string().optional(),
  LOCAL_IP: z.string().optional(),
  LOCAL_PORT: z.string().optional(),
  API_TIMEOUT_MS: z.string().optional(),
  ENABLE_API_LOGS: z.string().optional(),
  ENABLE_API_TRACING: z.string().optional(),
  ALLOW_CLEARTEXT: z.string().optional(),
  USE_MOCK_API: z.string().optional(),
});

export type AppEnv = {
  appEnv: 'development' | 'staging' | 'production';
  apiBaseUrl?: string;
  socketUrl?: string;
  localIp?: string;
  localPort?: number;
  apiTimeoutMs: number;
  enableApiLogs: boolean;
  enableApiTracing: boolean;
  allowCleartext: boolean;
  useMockApi: boolean;
};

const parseBool = (value?: string, fallback = false) => {
  if (value == null) return fallback;
  return value === 'true' || value === '1';
};

const parseNumber = (value?: string, fallback?: number) => {
  if (value == null || value.trim() === '') return fallback;
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
};

export const env: AppEnv = (() => {
  const parsed = envSchema.safeParse({
    APP_ENV: Config.APP_ENV,
    API_BASE_URL: Config.API_BASE_URL,
    SOCKET_URL: Config.SOCKET_URL,
    LOCAL_IP: Config.LOCAL_IP,
    LOCAL_PORT: Config.LOCAL_PORT,
    API_TIMEOUT_MS: Config.API_TIMEOUT_MS,
    ENABLE_API_LOGS: Config.ENABLE_API_LOGS,
    ENABLE_API_TRACING: Config.ENABLE_API_TRACING,
    ALLOW_CLEARTEXT: Config.ALLOW_CLEARTEXT,
    USE_MOCK_API: Config.USE_MOCK_API,
  });

  if (!parsed.success) {
    console.warn('[env] Invalid environment variables:', parsed.error.flatten().fieldErrors);
  }

  const raw = parsed.success ? parsed.data : {};
  const appEnv = raw.APP_ENV ?? (__DEV__ ? 'development' : 'production');

  return {
    appEnv,
    apiBaseUrl: raw.API_BASE_URL,
    socketUrl: raw.SOCKET_URL,
    localIp: raw.LOCAL_IP,
    localPort: parseNumber(raw.LOCAL_PORT),
    apiTimeoutMs: parseNumber(raw.API_TIMEOUT_MS, 15000) ?? 15000,
    enableApiLogs: parseBool(raw.ENABLE_API_LOGS, __DEV__),
    enableApiTracing: parseBool(raw.ENABLE_API_TRACING, __DEV__),
    allowCleartext: parseBool(raw.ALLOW_CLEARTEXT, __DEV__),
    useMockApi: parseBool(raw.USE_MOCK_API, false),
  };
})();
