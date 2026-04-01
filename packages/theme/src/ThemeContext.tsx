import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useColorScheme } from 'react-native';
import { MMKV } from 'react-native-mmkv';
import { ThemeMode } from '@dawwar/types';
import { lightColors, darkColors, type AppColors } from './colors';
import { typography, type TypographyVariant } from './typography';
import { space, radius, type SpacingKey } from './spacing';
import { shadows, type ShadowKey } from './shadows';

// MMKV instance for persisting theme preference
// Each app creates its own MMKV instance, but we use a standard key
const THEME_STORAGE_KEY = 'dawwar_theme_mode';

export interface ThemeContextValue {
  colors: AppColors;
  typography: typeof typography;
  space: typeof space;
  radius: typeof radius;
  shadows: typeof shadows;
  isDark: boolean;
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
}

export const ThemeContext = createContext<ThemeContextValue | null>(null);

interface ThemeProviderProps {
  children: React.ReactNode;
  storage: MMKV;  // each app passes its own MMKV instance
}

export function ThemeProvider({ children, storage }: ThemeProviderProps) {
  const systemScheme = useColorScheme();

  const [mode, setModeState] = useState<ThemeMode>(() => {
    const stored = storage.getString(THEME_STORAGE_KEY);
    console.log('[ThemeProvider] Initial mode from storage:', stored);
    if (stored === ThemeMode.LIGHT) return ThemeMode.LIGHT;
    if (stored === ThemeMode.DARK) return ThemeMode.DARK;
    return ThemeMode.SYSTEM;
  });

  const isDark = useMemo(() => {
    if (mode === ThemeMode.LIGHT) return false;
    if (mode === ThemeMode.DARK) return true;
    return systemScheme === 'dark';
  }, [mode, systemScheme]);

  const colors = useMemo(
    () => (isDark ? darkColors : lightColors),
    [isDark],
  );

  console.log('[ThemeProvider] Render:', { mode, isDark, systemScheme, colors: colors === lightColors ? 'light' : 'dark' });

  const setMode = useCallback(
    (newMode: ThemeMode) => {
      storage.set(THEME_STORAGE_KEY, newMode);
      setModeState(newMode);
    },
    [storage],
  );

  const value = useMemo<ThemeContextValue>(
    () => ({
      colors,
      typography,
      space,
      radius,
      shadows,
      isDark,
      mode,
      setMode,
    }),
    [colors, isDark, mode, setMode],
  );

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}
