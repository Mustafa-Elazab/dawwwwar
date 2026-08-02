import React, { useMemo } from 'react';
import { View } from 'react-native';
import { useTranslation } from '@dawwar/i18n';
import { useTheme } from '@dawwar/theme';
import { AppButton, AppCard, AppText, SectionHeader } from '@dawwar/ui';

import { BudgetSummaryCard } from '../../../budget/components';
import { getChecklistTitle } from '../../../checklist/utils/checklistLabels';
import { AdBanner } from '../../../monetization/components';
import { MissingEvent, ScreenFrame } from '../../../planner/components';
import { formatCountdown } from '../../../planner/utils/helpers';
import { useController } from './controller';
import { createStyles } from './styles';

export function EventDashboardScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const ctrl = useController();

  if (!ctrl.event) return <MissingEvent />;

  return (
    <ScreenFrame
      title={ctrl.event.title}
      subtitle={formatCountdown(t, ctrl.event)}
      showTabs
      headerActions={(
        <View style={styles.headerActions}>
          <AppButton
            label={t('farha.phase1.actions.editEvent')}
            size="sm"
            variant="outline"
            onPress={ctrl.editEvent}
          />
          {ctrl.isPro ? (
            <AppButton
              label={t('farha.phase1.actions.switchEvent')}
              size="sm"
              variant="outline"
              onPress={ctrl.switchEvent}
            />
          ) : null}
        </View>
      )}
    >
      <BudgetSummaryCard
        title={t('farha.phase1.dashboard.budgetSummary')}
        totals={ctrl.budgetTotals}
        onPress={ctrl.openBudget}
      />
      <AppCard variant="outlined" style={styles.section} onPress={ctrl.openChecklist}>
        <SectionHeader title={t('farha.phase1.dashboard.checklistSummary')} />
        <AppText variant="h3" align="auto">
          {t('farha.phase1.checklist.progress', {
            done: ctrl.checklistSummary.doneCount,
            total: ctrl.checklistSummary.actionableTotal,
          })}
        </AppText>
        <AppText variant="body2" color={colors.textSecondary} align="auto">
          {ctrl.checklistSummary.nextPending
            ? `${getChecklistTitle(t, ctrl.checklistSummary.nextPending)} - ${ctrl.checklistSummary.nextPending.dueDate ?? t('farha.phase1.labels.noDueDate')}`
            : t('farha.phase1.checklist.noPending')}
        </AppText>
      </AppCard>
      <AppButton
        label={t('farha.phase1.actions.shareResults')}
        onPress={ctrl.shareResults}
        fullWidth
      />
      {!ctrl.isPro ? <AdBanner /> : null}
    </ScreenFrame>
  );
}
