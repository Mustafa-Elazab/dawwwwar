import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { storage, StorageKeys } from '../../core/storage/mmkv';
import { ThemeMode, Language } from '@dawwar/types';

export interface UiState {
  themeMode: ThemeMode;
  language: Language;
  pushNotifications: boolean;
}

const initialState: UiState = {
  themeMode:
    (storage.getString(StorageKeys.THEME_MODE) as ThemeMode | undefined) ??
    ThemeMode.SYSTEM,
  language:
    (storage.getString(StorageKeys.APP_LANGUAGE) as Language | undefined) ??
    Language.AR,
  pushNotifications: storage.getBoolean(StorageKeys.PUSH_NOTIFICATIONS) ?? false,
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setThemeMode: (state, action: PayloadAction<ThemeMode>) => {
      state.themeMode = action.payload;
      storage.set(StorageKeys.THEME_MODE, action.payload);
    },
    setLanguage: (state, action: PayloadAction<Language>) => {
      state.language = action.payload;
      storage.set(StorageKeys.APP_LANGUAGE, action.payload);
    },
    setPushNotifications: (state, action: PayloadAction<boolean>) => {
      state.pushNotifications = action.payload;
      storage.set(StorageKeys.PUSH_NOTIFICATIONS, action.payload);
    },
  },
});

export const { setThemeMode, setLanguage, setPushNotifications } = uiSlice.actions;
export const selectThemeMode = (state: { ui: UiState }) => state.ui.themeMode;
export const selectLanguage = (state: { ui: UiState }) => state.ui.language;
export const selectPushNotifications = (state: { ui: UiState }) => state.ui.pushNotifications;
