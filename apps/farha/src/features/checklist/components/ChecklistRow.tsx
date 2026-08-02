import React, { useMemo } from 'react';
import { View } from 'react-native';
import { useTranslation } from '@dawwar/i18n';
import { useTheme } from '@dawwar/theme';
import { AppBadge, AppButton, AppPressable, AppText } from '@dawwar/ui';

import { isOverdue } from '../../planner/domain/phase1Logic';
import type { FarhaPhase1ChecklistItem } from '../../planner/domain/phase1Types';
import type { Phase1PlannerController } from '../../planner/hooks/usePhase1Planner';
import { getChecklistTitle } from '../utils/checklistLabels';
import { createPhase1ScreenStyles } from '../../planner/utils/styles';

interface ChecklistRowProps {
  controller: Phase1PlannerController;
  item: FarhaPhase1ChecklistItem;
  onPress: () => void;
}

export function ChecklistRow({ controller, item, onPress }: ChecklistRowProps) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const styles = useMemo(() => createPhase1ScreenStyles(colors), [colors]);
  const overdue = item.status === 'pending' && isOverdue(item.dueDate);

  return (
    <AppPressable
      accessibilityRole="button"
      accessibilityLabel={getChecklistTitle(t, item)}
      style={styles.listRow}
      onPress={onPress}
    >
      <View style={styles.rowText}>
        <AppText variant="label" align="auto">{getChecklistTitle(t, item)}</AppText>
        <AppText
          variant="caption"
          color={overdue ? colors.warning : colors.textSecondary}
          align="auto"
        >
          {item.dueDate ?? t('farha.phase1.labels.noDueDate')}
        </AppText>
      </View>
      <AppBadge
        label={t(`farha.phase1.checklist.status.${item.status}`)}
        variant={
          item.status === 'done'
            ? 'success'
            : item.status === 'skipped'
              ? 'neutral'
              : overdue
                ? 'warning'
                : 'info'
        }
      />
      {item.status === 'pending' ? (
        <AppButton
          label={t('farha.phase1.checklist.markDoneShort')}
          size="sm"
          onPress={() => controller.setChecklistItemStatus(item.id, 'done')}
        />
      ) : null}
    </AppPressable>
  );
}
