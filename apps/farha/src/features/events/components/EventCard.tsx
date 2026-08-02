import React, { useMemo } from 'react';
import { View } from 'react-native';
import { useTranslation } from '@dawwar/i18n';
import { useTheme } from '@dawwar/theme';
import { AppBadge, AppCard, AppText } from '@dawwar/ui';

import { calculateBudgetTotals } from '../../planner/domain/phase1Logic';
import type { FarhaPhase1Event } from '../../planner/domain/phase1Types';
import type { Phase1PlannerController } from '../../planner/hooks/usePhase1Planner';
import { formatCountdown, money } from '../../planner/utils/helpers';
import { createPhase1ScreenStyles } from '../../planner/utils/styles';

interface EventCardProps {
  controller: Phase1PlannerController;
  event: FarhaPhase1Event;
  onPress: () => void;
}

export function EventCard({ controller, event, onPress }: EventCardProps) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const styles = useMemo(() => createPhase1ScreenStyles(colors), [colors]);
  const totals = calculateBudgetTotals(controller.getEventBudgetItems(event.id));

  return (
    <AppCard variant="outlined" style={styles.section} onPress={onPress}>
      <View style={styles.row}>
        <View style={styles.rowText}>
          <AppText variant="h4" align="auto">{event.title}</AppText>
          <AppText variant="caption" color={colors.textSecondary} align="auto">
            {t(`farha.phase1.events.${event.type}`)} - {formatCountdown(t, event)}
          </AppText>
        </View>
        <AppBadge
          label={money(t, totals.actualTotal)}
          variant={totals.badge === 'over' ? 'warning' : 'success'}
        />
      </View>
    </AppCard>
  );
}
