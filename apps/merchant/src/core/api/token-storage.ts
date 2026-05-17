import { TokenStorage } from '@dawwar/api-client';
import { storage } from '../storage/mmkv';

const ACCESS_TOKEN_KEY = 'merchant_access_token';
const REFRESH_TOKEN_KEY = 'merchant_refresh_token';

export const mmkvTokenStorage: TokenStorage = {
  getAccessToken: () => storage.getString(ACCESS_TOKEN_KEY) || null,
  setAccessToken: (token: string) => storage.set(ACCESS_TOKEN_KEY, token),
  getRefreshToken: () => storage.getString(REFRESH_TOKEN_KEY) || null,
  setRefreshToken: (token: string) => storage.set(REFRESH_TOKEN_KEY, token),
  clearTokens: () => {
    storage.delete(ACCESS_TOKEN_KEY);
    storage.delete(REFRESH_TOKEN_KEY);
  },
};
