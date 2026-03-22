import { MMKV } from 'react-native-mmkv';

export const storage = new MMKV({
  id: 'dawwar-customer',
  encryptionKey: 'dawwar-customer-enc-2024',
});

export const StorageKeys = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  THEME_MODE: 'dawwar_theme_mode',
  APP_LANGUAGE: 'dawwar_language',
} as const;

export type StorageKey = (typeof StorageKeys)[keyof typeof StorageKeys];
