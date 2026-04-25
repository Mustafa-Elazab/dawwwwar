import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { TabScreenTemplate, Header, Text, LoadingSpinner } from '@dawwar/ui';
import { useTheme } from '@dawwar/theme';
import { space, typography, radius, shadows } from '@dawwar/theme';
import { useTranslation } from '@dawwar/i18n';
import { analyticsApi } from '../../core/api';

function KpiCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  const { colors } = useTheme();
  return (
    <View style={[styles.kpi, { backgroundColor: colors.card, ...shadows.sm }]}>
      <Text variant="h3" color={colors.primary} style={{ fontWeight: '800' }}>{value}</Text>
      <Text variant="caption" color={colors.textSecondary}>{label}</Text>
      {sub && <Text variant="overline" color={colors.textDisabled}>{sub}</Text>}
    </View>
  );
}

export function AnalyticsScreen() {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const [dateRange, setDateRange] = useState<'today' | 'week' | 'month'>('today');

  const { data, isLoading } = useQuery({
    queryKey: ['analytics', 'driver', dateRange],
    queryFn: async () => {
      if (dateRange === 'today') {
        return analyticsApi.getToday();
      }
      const end = new Date().toISOString();
      const start = new Date();
      if (dateRange === 'week') {
        start.setDate(start.getDate() - 7);
      } else {
        start.setDate(start.getDate() - 30);
      }
      return analyticsApi.getRange(start.toISOString(), end);
    },
    staleTime: 60_000,
  });

  if (isLoading || !data) return <LoadingSpinner fullscreen />;

  return (
    <TabScreenTemplate>
      <Header title={t('driver_app.analytics_title')} />
      <View style={styles.container}>
        {/* Date Range Selector */}
        <View style={styles.selector}>
          {(['today', 'week', 'month'] as const).map((range) => (
            <TouchableOpacity
              key={range}
              style={[
                styles.selectorBtn,
                { backgroundColor: dateRange === range ? colors.primary : colors.card },
              ]}
              onPress={() => setDateRange(range)}
            >
              <Text
                variant="caption"
                color={dateRange === range ? colors.white : colors.text}
              >
                {t(`common.${range}`)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* KPI Grid */}
        <View style={styles.grid}>
          <KpiCard
            label={t('driver_app.deliveries_count')}
            value={String(data.totalDeliveries)}
          />
          <KpiCard
            label={t('driver_app.total_earnings')}
            value={`${data.totalEarnings} ${t('common.egp')}`}
          />
          <KpiCard
            label={t('driver_app.avg_per_delivery')}
            value={`${data.avgEarningsPerDelivery.toFixed(0)} ${t('common.egp')}`}
          />
          <KpiCard
            label={t('driver_app.commission_paid')}
            value={`${data.commissionPaid} ${t('common.egp')}`}
          />
          <KpiCard
            label={t('driver_app.rating')}
            value={data.rating.toFixed(1)}
            sub={`${data.totalRatings} ${t('driver_app.reviews')}`}
          />
        </View>
      </View>
    </TabScreenTemplate>
  );
}

const styles = StyleSheet.create({
  container: { padding: space.base, flex: 1 },
  selector: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: space.sm,
    marginBottom: space.lg,
  },
  selectorBtn: {
    paddingVertical: space.sm,
    paddingHorizontal: space.md,
    borderRadius: radius.lg,
  },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: space.md },
  kpi: {
    width: '47%',
    padding: space.md,
    borderRadius: radius.xl,
    alignItems: 'center',
    gap: space[1],
  },
});
