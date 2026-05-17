import { IdempotencyStorage } from '@dawwar/api-client';
import { storage } from '../storage/mmkv';

export const mmkvIdempotencyStorage: IdempotencyStorage = {
  getItem: (key: string) => storage.getString(key) || null,
  setItem: (key: string, value: string) => storage.set(key, value),
  removeItem: (key: string) => storage.delete(key),
};
