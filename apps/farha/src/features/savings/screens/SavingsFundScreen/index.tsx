import React, { useMemo } from 'react';
import { ScrollView, View } from 'react-native';
import { useTranslation } from '@dawwar/i18n';
import { useTheme } from '@dawwar/theme';
import { AppButton, AppCard, AppInput, AppPressable, AppScreenTemplate, AppText, EmptyState, SectionHeader } from '@dawwar/ui';

import { usePlannerScreenChrome } from '../../../planner/hooks/usePlannerScreenChrome';
import { MissingEventState } from '../../../planner/states/MissingEventState';
import { money } from '../../../planner/utils/helpers';
import { useController } from './controller';
import { createStyles } from './styles';

export function SavingsFundScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const ctrl = useController();
  const screen = usePlannerScreenChrome({
    title: t('farha.phase1.savings.title'),
    subtitle: ctrl.event?.title,
    showBack: true,
  });

  if (!ctrl.event) return <MissingEventState />;

  return (
    <AppScreenTemplate {...screen.templateProps}>
      <ScrollView {...screen.scrollViewProps}>
        <AppCard variant="outlined" style={styles.section}>
          <SectionHeader title={t('farha.phase1.savings.balance')} />
          <AppText variant="h2" align="auto">{money(t, ctrl.summary.balance)}</AppText>
          <View style={styles.metricGrid}>
            <View style={styles.metric}>
              <AppText variant="caption" color={colors.textSecondary} align="auto">
                {t('farha.phase1.savings.thisMonth')}
              </AppText>
              <AppText variant="label" align="auto">
                {money(t, ctrl.summary.contributedThisMonth)}
              </AppText>
            </View>
            <View style={styles.metric}>
              <AppText variant="caption" color={colors.textSecondary} align="auto">
                {t('farha.phase1.savings.monthlyGoal')}
              </AppText>
              <AppText variant="label" align="auto">
                {ctrl.summary.monthlyGoal ? money(t, ctrl.summary.monthlyGoal) : t('farha.phase1.savings.noGoal')}
              </AppText>
            </View>
          </View>
          {ctrl.summary.monthlyGoal ? (
            <View style={styles.successBox}>
              <AppText variant="caption" align="auto">
                {t('farha.phase1.savings.goalProgress', {
                  percent: Math.round(ctrl.summary.monthlyProgress * 100),
                })}
              </AppText>
            </View>
          ) : null}
          <View style={styles.formGrid}>
            <AppInput
              containerStyle={styles.gridItem}
              label={t('farha.phase1.savings.goalInput')}
              keyboardType="numeric"
              value={ctrl.goalInput}
              onChangeText={ctrl.setGoalInput}
            />
            <View style={styles.gridItem}>
              <AppButton label={t('farha.phase1.actions.save')} onPress={ctrl.saveGoal} fullWidth />
            </View>
          </View>
        </AppCard>
        <View style={styles.formGrid}>
          <AppButton
            label={t('farha.phase1.savings.addContribution')}
            onPress={ctrl.addContribution}
            fullWidth
          />
          <AppButton
            label={t('farha.phase1.savings.allocateFunds')}
            variant="outline"
            onPress={ctrl.allocateFunds}
            disabled={ctrl.summary.balance <= 0}
            fullWidth
          />
        </View>
        <AppCard variant="outlined" style={styles.section}>
          <SectionHeader title={t('farha.phase1.savings.contributions')} />
          {ctrl.contributions.length ? (
            <View style={styles.stack}>
              {ctrl.contributions.map((contribution) => (
                <AppPressable
                  key={contribution.id}
                  accessibilityRole="button"
                  accessibilityLabel={t('farha.phase1.savings.editContribution')}
                  style={styles.listRow}
                  onPress={() => ctrl.editContribution(contribution.id)}
                >
                  <View style={styles.rowText}>
                    <AppText variant="label" align="auto">{money(t, contribution.amount)}</AppText>
                    <AppText variant="caption" color={colors.textSecondary} align="auto">
                      {contribution.note || t('farha.phase1.savings.noNote')}
                    </AppText>
                  </View>
                  <AppText variant="caption" color={colors.textSecondary} align="auto">
                    {contribution.date}
                  </AppText>
                </AppPressable>
              ))}
            </View>
          ) : (
            <EmptyState
              title={t('farha.phase1.savings.emptyTitle')}
              subtitle={t('farha.phase1.savings.emptyBody')}
            />
          )}
        </AppCard>
      </ScrollView>
    </AppScreenTemplate>
  );
}
