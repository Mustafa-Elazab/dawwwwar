import React from 'react';
import { useTranslation } from '@dawwar/i18n';
import { ScrollScreenTemplate } from '@dawwar/ui';
import { useTheme } from '@dawwar/theme';
import { ProfileContent } from './components/ProfileContent';
import { useController } from './useController';

export function ProfileScreen() {
  const { t, i18n } = useTranslation();
  const { colors } = useTheme();
  const ctrl = useController();
  const languageLabel = i18n.language.startsWith('ar') ? t('language.arabic') : t('language.english');

  return (
    <ScrollScreenTemplate
      edges={['top']}
      headerProps={{
        title: t('profile.title'),
        type: 'none',
      }}
    >
      <ProfileContent
        colors={colors}
        controller={ctrl}
        t={t}
        languageLabel={languageLabel}
      />
    </ScrollScreenTemplate>
  );
}
