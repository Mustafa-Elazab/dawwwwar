import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { ThemeMode, Language } from '@dawwar/types';

interface UIState {
  themeMode: ThemeMode;
  language: Language;
}

const initialState: UIState = {
  themeMode: ThemeMode.SYSTEM,
  language: Language.AR,
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setThemeMode: (state, action: PayloadAction<ThemeMode>) => {
      state.themeMode = action.payload;
    },
    setLanguage: (state, action: PayloadAction<Language>) => {
      state.language = action.payload;
    },
  },
});

export const { setThemeMode, setLanguage } = uiSlice.actions;

export const selectThemeMode = (state: { ui: UIState }) => state.ui.themeMode;
export const selectLanguage = (state: { ui: UIState }) => state.ui.language;
