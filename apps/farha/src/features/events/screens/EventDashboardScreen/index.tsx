import React, { useMemo } from 'react';
import { ScrollView, View } from 'react-native';
import { useTranslation } from '@dawwar/i18n';
import { useTheme } from '@dawwar/theme';
import { AppButton, AppCard, AppScreenTemplate, AppText, SectionHeader } from '@dawwar/ui';

import { BudgetSummaryCard } from '../../../budget/components';
import { getChecklistTitle } from '../../../checklist/utils/checklistLabels';
import { FarhaAdBanner } from '../../../monetization/ads/FarhaAdBanner';
import { usePlannerScreenChrome } from '../../../planner/hooks/usePlannerScreenChrome';
import { MissingEventState } from '../../../planner/states/MissingEventState';
import { formatCountdown, money } from '../../../planner/utils/helpers';
import { useController } from './controller';
import { createStyles } from './styles';

export function EventDashboardScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const ctrl = useController();
  const screen = usePlannerScreenChrome({
    title: ctrl.event?.title ?? t('farha.phase1.errors.missingEvent'),
    subtitle: ctrl.event ? formatCountdown(t, ctrl.event) : undefined,
    showTabs: true,
    headerActions: (
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
    ),
  });

  if (!ctrl.event) return <MissingEventState />;

  return (
    <AppScreenTemplate {...screen.templateProps}>
      <ScrollView {...screen.scrollViewProps}>
        <BudgetSummaryCard
          title={t('farha.phase1.dashboard.budgetSummary')}
          totals={ctrl.budgetTotals}
          onPress={ctrl.openBudget}
        />
        <FarhaAdBanner isPro={ctrl.isPro} placement="dashboard" />
        <AppCard variant="outlined" style={styles.section} onPress={ctrl.openSavings}>
          <SectionHeader title={t('farha.phase1.savings.dashboardTitle')} />
          <AppText variant="h3" align="auto">
            {money(t, ctrl.savingsSummary.balance)}
          </AppText>
          <AppText variant="body2" color={colors.textSecondary} align="auto">
            {ctrl.savingsSummary.monthlyGoal
              ? t('farha.phase1.savings.dashboardGoal', {
                  saved: money(t, ctrl.savingsSummary.contributedThisMonth),
                  goal: money(t, ctrl.savingsSummary.monthlyGoal),
                })
              : t('farha.phase1.savings.dashboardNoGoal')}
          </AppText>
        </AppCard>
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
      </ScrollView>
    </AppScreenTemplate>
  );
}
