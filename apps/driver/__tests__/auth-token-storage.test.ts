jest.mock('react-native-mmkv', () => {
  class MockMMKV {
    private values = new Map<string, string | boolean | number>();

    getString(key: string) {
      const value = this.values.get(key);
      return typeof value === 'string' ? value : undefined;
    }

    set(key: string, value: string | boolean | number) {
      this.values.set(key, value);
    }

    delete(key: string) {
      this.values.delete(key);
    }
  }

  return { MMKV: MockMMKV };
});

import { mmkvTokenStorage } from '../src/core/api/token-storage';
import { storage, StorageKeys } from '../src/core/storage/mmkv';

describe('driver auth token storage', () => {
  beforeEach(() => {
    storage.delete(StorageKeys.ACCESS_TOKEN);
    storage.delete(StorageKeys.REFRESH_TOKEN);
  });

  it('uses the shared driver access token keys for API requests', () => {
    mmkvTokenStorage.setAccessToken('access-token-1');
    mmkvTokenStorage.setRefreshToken('refresh-token-1');

    expect(storage.getString(StorageKeys.ACCESS_TOKEN)).toBe('access-token-1');
    expect(storage.getString(StorageKeys.REFRESH_TOKEN)).toBe('refresh-token-1');
    expect(mmkvTokenStorage.getAccessToken()).toBe('access-token-1');
    expect(mmkvTokenStorage.getRefreshToken()).toBe('refresh-token-1');
  });

  it('clears persisted tokens on logout', () => {
    mmkvTokenStorage.setAccessToken('access-token-1');
    mmkvTokenStorage.setRefreshToken('refresh-token-1');

    mmkvTokenStorage.clearTokens();

    expect(mmkvTokenStorage.getAccessToken()).toBeNull();
    expect(mmkvTokenStorage.getRefreshToken()).toBeNull();
  });
});
