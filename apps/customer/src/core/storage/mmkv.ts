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
  ONBOARDING_SEEN: 'dawwar_onboarding_seen',
  PAYMENT_METHODS: 'dawwar_payment_methods',
  SELECTED_PAYMENT_METHOD: 'dawwar_selected_payment_method',
  PUSH_NOTIFICATIONS: 'dawwar_push_notifications',
  PUSH_NOTIFICATION_PROMPTED: 'dawwar_push_notification_prompted',
} as const;

export type StorageKey = (typeof StorageKeys)[keyof typeof StorageKeys];
