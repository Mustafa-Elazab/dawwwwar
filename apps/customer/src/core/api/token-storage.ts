import { TokenStorage } from '@dawwar/api-client';
import { storage, StorageKeys } from '../storage/mmkv';

export const mmkvTokenStorage: TokenStorage = {
  getAccessToken: () => storage.getString(StorageKeys.ACCESS_TOKEN) || null,
  setAccessToken: (token: string) => storage.set(StorageKeys.ACCESS_TOKEN, token),
  getRefreshToken: () => storage.getString(StorageKeys.REFRESH_TOKEN) || null,
  setRefreshToken: (token: string) => storage.set(StorageKeys.REFRESH_TOKEN, token),
  clearTokens: () => {
    storage.delete(StorageKeys.ACCESS_TOKEN);
    storage.delete(StorageKeys.REFRESH_TOKEN);
  },
};
