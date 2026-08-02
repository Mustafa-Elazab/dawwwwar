import React, { useMemo } from 'react';
import { View } from 'react-native';
import { useTranslation } from '@dawwar/i18n';
import { useTheme } from '@dawwar/theme';
import { AppBadge, AppCard, AppText } from '@dawwar/ui';

import type {
  BudgetTotals,
  FarhaPhase1Event,
} from '../../planner/domain/phase1Types';
import { formatCountdown, money } from '../../planner/utils/helpers';
import { createPhase1ScreenStyles } from '../../planner/utils/styles';

interface EventCardProps {
  event: FarhaPhase1Event;
  totals: BudgetTotals;
  onPress: () => void;
}

export function EventCard({ event, totals, onPress }: EventCardProps) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const styles = useMemo(() => createPhase1ScreenStyles(colors), [colors]);

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
