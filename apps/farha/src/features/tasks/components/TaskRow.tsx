import React, { useMemo } from 'react';
import { I18nManager, StyleSheet, View } from 'react-native';
import { useTranslation } from '@dawwar/i18n';
import { useTheme, spacing } from '@dawwar/theme';
import { AppBadge, AppButton, AppIcon, AppPressable, AppText } from '@dawwar/ui';

import {
  calculateTaskBalance,
  getTaskPaymentStatus,
} from '../../../core/planner/domain/phase1Logic';
import type { FarhaPhase1Task } from '../../../core/planner/domain/phase1Types';
import { money } from '../../planner/utils/helpers';
import { getTaskCategoryLabel, getTaskTitle } from '../utils/taskLabels';

interface TaskRowProps {
  task: FarhaPhase1Task;
  isCelebrating?: boolean;
  onPress: () => void;
  onMarkDone: () => void;
  onLogPayment: () => void;
}

export function TaskRow({
  task,
  isCelebrating,
  onPress,
  onMarkDone,
  onLogPayment,
}: TaskRowProps) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const styles = useMemo(
    () => createStyles(colors.textSecondary, colors.card, colors.border, colors.primary),
    [colors],
  );
  const hasCost = typeof task.plannedCost === 'number' || typeof task.actualCost === 'number';
  const balance = calculateTaskBalance(task);
  const paymentStatus = getTaskPaymentStatus(task);

  return (
    <AppPressable
      accessibilityRole="button"
      accessibilityLabel={getTaskTitle(t, task)}
      onPress={onPress}
      style={styles.row}
    >
      <View style={[styles.iconCircle, { backgroundColor: colors.primaryLight }]}>
        <AppIcon
          name={task.status === 'done' ? 'check-circle' : 'clipboard-check-outline'}
          size={22}
          color={colors.primary}
        />
      </View>
      <View style={styles.copy}>
        <View style={styles.titleRow}>
          <AppText variant="label" align="auto" numberOfLines={2}>
            {getTaskTitle(t, task)}
          </AppText>
          {isCelebrating ? (
            <View style={styles.pop}>
              <AppIcon name="check" size={18} color={colors.primaryText} />
            </View>
          ) : null}
        </View>
        <AppText variant="caption" color={colors.textSecondary} align="auto" numberOfLines={2}>
          {getTaskCategoryLabel(t, task)} · {task.dueDate ?? t('farha.phase1.labels.noDueDate')}
        </AppText>
        <View style={styles.badges}>
          <AppBadge label={t(`farha.phase1.checklist.status.${task.status}`)} variant={task.status === 'done' ? 'success' : 'info'} />
          {hasCost ? (
            <AppBadge label={`${t(`farha.phase1.budget.status.${paymentStatus}`)} · ${money(t, balance)}`} variant={paymentStatus === 'paid' ? 'success' : 'warning'} />
          ) : null}
        </View>
      </View>
      <View style={styles.actions}>
        {task.paymentPlan && balance > 0 ? (
          <AppButton label={t('farha.phase1.tasks.logPaymentShort')} size="sm" variant="outline" onPress={onLogPayment} />
        ) : null}
        {task.status !== 'done' ? (
          <AppButton label={t('farha.phase1.checklist.markDoneShort')} size="sm" onPress={onMarkDone} />
        ) : null}
      </View>
    </AppPressable>
  );
}

const createStyles = (
  muted: string,
  card: string,
  border: string,
  primary: string,
) => StyleSheet.create({
  row: {
    minHeight: 86,
    borderRadius: 24,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: border,
    backgroundColor: card,
    padding: spacing[4],
    flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
    alignItems: 'center',
    gap: spacing[3],
    shadowColor: muted,
    shadowOpacity: 0.14,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  copy: {
    flex: 1,
    gap: spacing[2],
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  badges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[2],
  },
  actions: {
    maxWidth: 116,
    gap: spacing[2],
  },
  pop: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: primary,
  },
});
