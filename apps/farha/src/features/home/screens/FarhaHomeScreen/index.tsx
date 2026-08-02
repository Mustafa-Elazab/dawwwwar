import React, { useMemo } from 'react';
import { View } from 'react-native';
import { useTranslation } from '@dawwar/i18n';
import { useTheme } from '@dawwar/theme';
import { AppButton, AppCard, AppScreenTemplate, AppText, SectionHeader } from '@dawwar/ui';

import { useController } from './controller';
import { createStyles } from './styles';

export function FarhaHomeScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const ctrl = useController();

  return (
    <AppScreenTemplate testID="farha-home-screen" contentStyle={styles.content}>
      <View style={styles.hero}>
        <AppText variant="label" color={colors.primary}>
          {t('farha.m0.eyebrow')}
        </AppText>
        <AppText variant="h1" align="auto">
          {t('farha.m0.title')}
        </AppText>
        <AppText variant="body1" color={colors.textSecondary} align="auto">
          {t('farha.m0.body')}
        </AppText>
      </View>

      <AppCard variant="outlined" style={styles.card}>
        <SectionHeader title={t('farha.m0.readinessTitle')} />
        <View style={styles.readinessList}>
          {ctrl.readinessTranslationKeys.map((key) => (
            <View key={key} style={styles.readinessRow}>
              <View style={styles.readinessDot} />
              <AppText style={styles.readinessText} align="auto">
                {t(key)}
              </AppText>
            </View>
          ))}
        </View>
      </AppCard>

      <AppButton label={t('farha.m0.nextAction')} disabled fullWidth />
    </AppScreenTemplate>
  );
}
