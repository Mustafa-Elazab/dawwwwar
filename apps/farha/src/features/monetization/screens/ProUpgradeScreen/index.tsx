import React, { useMemo } from 'react';
import { View } from 'react-native';
import { useTranslation } from '@dawwar/i18n';
import { useTheme } from '@dawwar/theme';
import { AppButton, AppCard, AppText } from '@dawwar/ui';

import { ScreenFrame } from '../../../planner/components';
import { useController } from './controller';
import { createStyles } from './styles';

export function ProUpgradeScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const ctrl = useController();

  return (
    <ScreenFrame title={t('farha.phase1.pro.title')} subtitle={t('farha.phase1.pro.subtitle')} showBack>
      <View style={styles.stack}>
        {ctrl.benefits.map((benefit) => (
          <AppCard key={benefit} variant="outlined" style={styles.section}>
            <AppText variant="h4" align="auto">{t(`farha.phase1.pro.${benefit}.title`)}</AppText>
            <AppText variant="body2" color={colors.textSecondary} align="auto">
              {t(`farha.phase1.pro.${benefit}.body`)}
            </AppText>
          </AppCard>
        ))}
      </View>
      <AppButton label={t('farha.phase1.actions.upgrade')} onPress={ctrl.upgradeToPro} fullWidth />
      <AppButton label={t('farha.phase1.actions.restorePurchase')} variant="ghost" onPress={ctrl.restorePurchase} fullWidth />
    </ScreenFrame>
  );
}
