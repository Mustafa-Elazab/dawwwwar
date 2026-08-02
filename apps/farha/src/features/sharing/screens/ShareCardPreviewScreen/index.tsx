import React, { useMemo } from 'react';
import { View } from 'react-native';
import { useTranslation } from '@dawwar/i18n';
import { useTheme } from '@dawwar/theme';
import { AppButton, AppText } from '@dawwar/ui';

import { BudgetBadge } from '../../../budget/components';
import { MissingEvent, ScreenFrame } from '../../../planner/components';
import { formatCountdown, money } from '../../../planner/utils/helpers';
import type { Phase1ScreenProps } from '../../../planner/types/screenTypes';
import { createStyles } from './styles';
import { useController } from '../../hooks/useShareCardPreviewController';

export function ShareCardPreviewScreen({ controller }: Phase1ScreenProps) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const ctrl = useController(controller);

  if (!ctrl.event) return <MissingEvent controller={controller} />;

  return (
    <ScreenFrame title={t('farha.phase1.share.title')} subtitle={t('farha.phase1.share.subtitle')} controller={controller} showBack>
      <View style={styles.shareCard}>
        <View style={styles.stack}>
          <AppText variant="h2" align="auto">{ctrl.event.title}</AppText>
          <AppText variant="body2" align="auto">
            {ctrl.event.date} - {formatCountdown(t, ctrl.event)}
          </AppText>
        </View>
        <View style={styles.stack}>
          <AppText variant="h4" align="auto">
            {t('farha.phase1.share.budgetLine', {
              planned: money(t, ctrl.totals.plannedTotal),
              actual: money(t, ctrl.totals.actualTotal),
            })}
          </AppText>
          <AppText variant="h4" align="auto">
            {t('farha.phase1.checklist.progress', {
              done: ctrl.summary.doneCount,
              total: ctrl.summary.actionableTotal,
            })}
          </AppText>
          <BudgetBadge totals={ctrl.totals} />
        </View>
        <AppText variant="caption" align="auto">{t('farha.phase1.share.madeWith')}</AppText>
      </View>
      <AppButton label={t('farha.phase1.actions.share')} onPress={ctrl.share} fullWidth />
      <AppButton label={t('farha.phase1.actions.saveImage')} variant="outline" disabled fullWidth />
      <AppText variant="caption" color={colors.textSecondary} align="auto">
        {ctrl.sharePayload}
      </AppText>
    </ScreenFrame>
  );
}
