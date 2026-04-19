import React, { useMemo } from 'react';
import { View } from 'react-native';
import { useTheme } from '@dawwar/theme';
import { Text } from '@dawwar/ui';
import { useTranslation } from '@dawwar/i18n';
import { createStyles } from './styles';
import type { DailyEarning } from '../../core/api';

interface WeeklyChartProps {
  data: DailyEarning[];
}

const CHART_MAX_HEIGHT = 80; // px

export function WeeklyChart({ data }: WeeklyChartProps) {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const { i18n } = useTranslation();

  const maxNet = useMemo(() => Math.max(...data.map((d) => d.net), 1), [data]);
  const todayIndex = new Date().getDay();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Last 7 days</Text>
      <View style={styles.chartRow}>
        {data.map((day, i) => {
          const barHeight = Math.max((day.net / maxNet) * CHART_MAX_HEIGHT, 4);
          const isToday = i === todayIndex;
          const label = i18n.language === 'ar' ? day.dayAr : day.day;
          return (
            <View key={day.day} style={styles.barCol}>
              <Text style={styles.amountLabel}>
                {day.net > 0 ? String(day.net) : ''}
              </Text>
              <View
                style={[
                  styles.bar,
                  {
                    height: barHeight,
                    backgroundColor: isToday ? colors.primary : colors.primaryMuted,
                  },
                ]}
              />
              <Text
                style={[
                  styles.dayLabel,
                  isToday && { color: colors.primary, fontWeight: '700' },
                ]}
              >
                {label}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}
