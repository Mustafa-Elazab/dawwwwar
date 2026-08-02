import React, { useMemo } from 'react';
import { View } from 'react-native';
import { useTranslation } from '@dawwar/i18n';
import { useTheme } from '@dawwar/theme';
import { AppBadge, AppPressable, AppText } from '@dawwar/ui';

import {
  calculateItemBalance,
  getBudgetItemStatus,
} from '../../../core/planner/domain/phase1Logic';
import type { FarhaPhase1BudgetItem } from '../../../core/planner/domain/phase1Types';
import { money } from '../../planner/utils/helpers';
import { createPhase1ScreenStyles } from '../../planner/utils/styles';

interface BudgetItemRowProps {
  item: FarhaPhase1BudgetItem;
  onPress: () => void;
}

export function BudgetItemRow({ item, onPress }: BudgetItemRowProps) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const styles = useMemo(() => createPhase1ScreenStyles(colors), [colors]);
  const status = getBudgetItemStatus(item);

  return (
    <AppPressable
      accessibilityRole="button"
      accessibilityLabel={item.name}
      style={styles.listRow}
      onPress={onPress}
    >
      <View style={styles.rowText}>
        <AppText variant="label" align="auto">{item.name}</AppText>
        <AppText variant="caption" color={colors.textSecondary} align="auto">
          {item.dueDate ?? t('farha.phase1.labels.noDueDate')}
        </AppText>
      </View>
      <View style={styles.rowSide}>
        <AppText variant="label" align="auto">
          {money(t, item.actualCost ?? item.plannedCost)}
        </AppText>
        <AppText variant="caption" color={colors.textSecondary} align="auto">
          {money(t, calculateItemBalance(item))}
        </AppText>
      </View>
      <AppBadge
        label={t(`farha.phase1.budget.status.${status}`)}
        variant={status === 'paid' ? 'success' : status === 'partial' ? 'warning' : 'neutral'}
      />
    </AppPressable>
  );
}
