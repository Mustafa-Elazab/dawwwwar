import React, { useMemo } from 'react';
import { View } from 'react-native';
import { useTranslation } from '@dawwar/i18n';
import { useTheme } from '@dawwar/theme';
import { AppCard, AppText, SectionHeader } from '@dawwar/ui';

import type { BudgetTotals } from '../../planner/domain/phase1Types';
import { money } from '../../planner/utils/helpers';
import { createPhase1ScreenStyles } from '../../planner/utils/styles';
import { BudgetBadge } from './BudgetBadge';

interface BudgetSummaryCardProps {
  title: string;
  totals: BudgetTotals;
  onPress?: () => void;
}

export function BudgetSummaryCard({ title, totals, onPress }: BudgetSummaryCardProps) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const styles = useMemo(() => createPhase1ScreenStyles(colors), [colors]);

  return (
    <AppCard variant="outlined" style={styles.section} onPress={onPress}>
      <SectionHeader title={title} />
      <View style={styles.metricGrid}>
        <Metric label={t('farha.phase1.labels.planned')} value={money(t, totals.plannedTotal)} />
        <Metric label={t('farha.phase1.labels.actual')} value={money(t, totals.actualTotal)} />
        <Metric label={t('farha.phase1.labels.deposits')} value={money(t, totals.depositTotal)} />
        <Metric label={t('farha.phase1.labels.balance')} value={money(t, totals.balanceTotal)} />
      </View>
      <BudgetBadge totals={totals} />
    </AppCard>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  const { colors } = useTheme();
  const styles = useMemo(() => createPhase1ScreenStyles(colors), [colors]);

  return (
    <View style={styles.metric}>
      <AppText variant="caption" color={colors.textSecondary} align="auto">{label}</AppText>
      <AppText variant="h4" align="auto" numberOfLines={1}>{value}</AppText>
    </View>
  );
}
