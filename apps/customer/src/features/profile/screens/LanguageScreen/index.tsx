import React from 'react';
import { ScreenTemplate } from '@dawwar/ui';
import { useTheme } from '@dawwar/theme';
import { LanguageOptions } from './components/LanguageOptions';
import { useController } from './useController';

export function LanguageScreen() {
  const { colors } = useTheme();
  const ctrl = useController();

  return (
    <ScreenTemplate
      headerProps={{ title: ctrl.headerTitle }}
    >
      <LanguageOptions
        colors={colors}
        options={ctrl.languages}
        currentLanguage={ctrl.currentLanguage}
        onSelect={ctrl.handleSelect}
      />
    </ScreenTemplate>
  );
}
