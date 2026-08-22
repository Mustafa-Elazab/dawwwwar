import React, { useMemo } from 'react';
import { ScrollView, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useTranslation } from '@dawwar/i18n';
import { useTheme } from '@dawwar/theme';
import { AppBadge, AppButton, AppCard, AppScreenTemplate, AppText, SectionHeader } from '@dawwar/ui';

import { BudgetSummaryCard } from '../../../budget/components';
import { FarhaAdBanner } from '../../../monetization/ads/FarhaAdBanner';
import { usePlannerScreenChrome } from '../../../planner/hooks/usePlannerScreenChrome';
import { MissingEventState } from '../../../planner/states/MissingEventState';
import { formatCountdown, money } from '../../../planner/utils/helpers';
import { WalkthroughTarget } from '../../../tips/components/WalkthroughTargetContext';
import { getTaskTitle } from '../../../tasks/utils/taskLabels';
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
    coverPhotoUri: ctrl.event?.coverPhotoUri,
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
        <Animated.View entering={FadeInUp.duration(260)}>
          <WalkthroughTarget step="dashboardOverview">
            <BudgetSummaryCard
              title={t('farha.phase1.dashboard.tasksSummary')}
              totals={ctrl.budgetTotals}
              onPress={ctrl.openTasks}
            />
          </WalkthroughTarget>
        </Animated.View>
        {ctrl.budgetHealth ? (
          <Animated.View entering={FadeInUp.delay(60).duration(260)}>
            <AppCard variant="outlined" style={styles.section}>
              <SectionHeader title={t('farha.phase1.dashboard.budgetHealth')} />
              <View style={styles.metricGrid}>
                <View style={styles.metric}>
                  <AppText variant="caption" color={colors.textSecondary} align="auto">
                    {t('farha.phase1.labels.budgetSpent')}
                  </AppText>
                  <AppText variant="h4" align="auto" numberOfLines={1}>
                    {money(t, ctrl.budgetHealth.spentTotal)}
                  </AppText>
                </View>
                <View style={styles.metric}>
                  <AppText variant="caption" color={colors.textSecondary} align="auto">
                    {t('farha.phase1.labels.budgetAvailable')}
                  </AppText>
                  <AppText variant="h4" align="auto" numberOfLines={1}>
                    {money(t, ctrl.budgetHealth.availableTotal)}
                  </AppText>
                </View>
              </View>
              <AppText variant="body2" color={colors.textSecondary} align="auto">
                {t('farha.phase1.dashboard.budgetHealthBody', {
                  remaining: money(t, ctrl.budgetHealth.plannedRemaining),
                  gap: money(t, Math.abs(ctrl.budgetHealth.availableAfterPlanned)),
                })}
              </AppText>
              <AppBadge
                label={t(`farha.phase1.dashboard.budgetHealthStatus.${ctrl.budgetHealth.status}`)}
                variant={ctrl.budgetHealth.status === 'healthy' ? 'success' : 'warning'}
              />
            </AppCard>
          </Animated.View>
        ) : null}
        <FarhaAdBanner isPro={ctrl.isPro} placement="dashboard" />
        <Animated.View entering={FadeInUp.delay(120).duration(260)}>
          <AppCard variant="outlined" style={styles.section} onPress={ctrl.openTasks}>
            <SectionHeader title={t('farha.phase1.dashboard.actionSummary')} />
            <AppText variant="h3" align="auto">
              {t('farha.phase1.checklist.progress', {
                done: ctrl.taskSummary.doneCount,
                total: ctrl.taskSummary.actionableTotal,
              })}
            </AppText>
            <AppText variant="body2" color={colors.textSecondary} align="auto">
              {ctrl.taskSummary.nextPending
                ? `${getTaskTitle(t, ctrl.taskSummary.nextPending)} - ${ctrl.taskSummary.nextPending.dueDate ?? t('farha.phase1.labels.noDueDate')}`
                : t('farha.phase1.checklist.noPending')}
            </AppText>
          </AppCard>
        </Animated.View>
        <AppButton
          label={t('farha.phase1.actions.shareResults')}
          onPress={ctrl.shareResults}
          fullWidth
        />
      </ScrollView>
    </AppScreenTemplate>
  );
}
