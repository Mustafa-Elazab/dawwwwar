import React, { useMemo } from 'react';
import { View } from 'react-native';
import { useTranslation } from '@dawwar/i18n';
import { useTheme } from '@dawwar/theme';
import { AppButton, AppCard, AppText } from '@dawwar/ui';

import { ScreenFrame } from '../../../planner/components';
import { useController } from './controller';
import { createStyles } from './styles';

export function OnboardingWelcomeScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const ctrl = useController();

  return (
    <ScreenFrame title={t('farha.phase1.onboarding.title')} subtitle={t('farha.phase1.onboarding.subtitle')}>
      <View style={styles.stack}>
        {ctrl.slides.map((slide) => (
          <AppCard key={slide} variant="outlined" style={styles.section}>
            <AppText variant="h4" align="auto">{t(`farha.phase1.onboarding.${slide}.title`)}</AppText>
            <AppText variant="body2" color={colors.textSecondary} align="auto">
              {t(`farha.phase1.onboarding.${slide}.body`)}
            </AppText>
          </AppCard>
        ))}
      </View>
      <View style={styles.stack}>
        <AppButton
          label={t('farha.phase1.actions.getStarted')}
          onPress={ctrl.completeOnboarding}
          fullWidth
        />
        <AppButton
          label={t('farha.phase1.actions.skip')}
          variant="ghost"
          onPress={ctrl.completeOnboarding}
          fullWidth
        />
      </View>
    </ScreenFrame>
  );
}
