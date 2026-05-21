import { Platform } from 'react-native';
import { env } from './env';
import { DEV_HOSTS, NETWORK_DEFAULTS } from '../constants/network';

const isLocalHost = (url?: string) => {
  if (!url) return false;
  return (
    url.includes('localhost') ||
    url.includes('127.0.0.1') ||
    url.includes('10.0.2.2') ||
    url.includes('0.0.0.0')
  );
};

const resolveDevHost = () => {
  if (env.localIp) return env.localIp;
  return Platform.OS === 'android' ? DEV_HOSTS.androidEmulator : DEV_HOSTS.iosSimulator;
};

export const getApiBaseUrl = () => {
  if (env.apiBaseUrl && !__DEV__) return env.apiBaseUrl;

  if (__DEV__) {
    const host = resolveDevHost();
    const base = env.apiBaseUrl;
    if (!base || isLocalHost(base)) {
      return `http://${host}:${env.localPort ?? NETWORK_DEFAULTS.apiPort}${NETWORK_DEFAULTS.apiPrefix}`;
    }
    return base;
  }

  return env.apiBaseUrl ?? `https://api.dawwar.com${NETWORK_DEFAULTS.apiPrefix}`;
};

export const getSocketUrl = () => {
  if (env.socketUrl && !__DEV__) return env.socketUrl;

  if (__DEV__) {
    const host = resolveDevHost();
    const base = env.socketUrl;
    if (!base || isLocalHost(base)) {
      return `http://${host}:${env.localPort ?? NETWORK_DEFAULTS.socketPort}`;
    }
    return base;
  }

  return env.socketUrl ?? 'https://api.dawwar.com';
};
