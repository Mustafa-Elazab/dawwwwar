import React, { useMemo } from 'react';
import { ScrollView, View } from 'react-native';
import { useTranslation } from '@dawwar/i18n';
import { useTheme } from '@dawwar/theme';
import { AppScreenTemplate, AppText } from '@dawwar/ui';

import { useController } from './controller';
import { createStyles } from './styles';

export function SplashScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const ctrl = useController();

  return (
    <AppScreenTemplate contentStyle={styles.screenContent} isLoading={ctrl.status === 'loading'}>
      <ScrollView contentContainerStyle={[styles.scrollContent, styles.centered]}>
        <View style={styles.cardTint}>
          <AppText variant="h1" align="center">{t('farha.phase1.brand')}</AppText>
          <AppText variant="body1" color={colors.textSecondary} align="center">
            {t('farha.phase1.splash.subtitle')}
          </AppText>
        </View>
      </ScrollView>
    </AppScreenTemplate>
  );
}
