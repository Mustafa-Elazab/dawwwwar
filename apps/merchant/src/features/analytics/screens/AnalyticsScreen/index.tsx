import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { TabScreenTemplate, Header, Text, LoadingSpinner } from '@dawwar/ui';
import { useTheme } from '@dawwar/theme';
import { space, typography, radius, shadows } from '@dawwar/theme';
import { useTranslation } from '@dawwar/i18n';
import { analyticsApi } from '../../core/api';
import { mockMerchants } from '@dawwar/mocks';
import { useAppSelector } from '../../../../store/hooks';
import { selectUser } from '../../../../store/slices/auth.slice';

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
  const user = useAppSelector(selectUser);
  const merchant = mockMerchants.find((m) => m.userId === user?.id);

  const { data, isLoading } = useQuery({
    queryKey: ['analytics', 'today', merchant?.id],
    queryFn: () => analyticsApi.getToday(merchant?.id ?? ''),
    enabled: !!merchant?.id,
    staleTime: 120_000,
  });

  if (isLoading || !data) return <LoadingSpinner fullscreen />;

  return (
    <TabScreenTemplate>
      <Header title={t('merchant_app.analytics_title')} />
      <View style={styles.container}>
        <Text variant="label" color={colors.textSecondary} style={{ marginBottom: space.base }}>
          {t('merchant_app.analytics_today')} — {new Date().toLocaleDateString('ar-EG')}
        </Text>
        <View style={styles.grid}>
          <KpiCard label={t('merchant_app.orders_count')} value={String(data.totalOrders)} />
          <KpiCard label={t('merchant_app.revenue')} value={`${data.totalRevenue} ${t('common.egp')}`} />
          <KpiCard label={t('merchant_app.avg_order')} value={`${data.avgOrderValue.toFixed(0)} ${t('common.egp')}`} />
          <KpiCard label={t('merchant_app.commission_paid')} value={`${data.commissionPaid} ${t('common.egp')}`} />
        </View>
      </View>
    </TabScreenTemplate>
  );
}

const styles = StyleSheet.create({
  container: { padding: space.base, flex: 1 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: space.md },
  kpi: {
    width: '47%', padding: space.md, borderRadius: radius.xl,
    alignItems: 'center', gap: space[1],
  },
});
