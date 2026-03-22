import { useContext } from 'react';
import { ThemeContext, type ThemeContextValue } from './ThemeContext';

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (ctx === null) {
    throw new Error(
      'useTheme() was called outside of <ThemeProvider>. ' +
      'Make sure ThemeProvider wraps your entire app in AppProviders.',
    );
  }
  return ctx;
}
