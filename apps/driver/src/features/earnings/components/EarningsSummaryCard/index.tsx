import React from 'react';
import { View } from 'react-native';
import { useTheme } from '@dawwar/theme';
import { Text, Icon } from '@dawwar/ui';
import { useTranslation } from '@dawwar/i18n';
import { createStyles } from './styles';
import type { EarningsSummary } from '../../core/api';

interface EarningsSummaryCardProps {
  summary: EarningsSummary;
  walletBalance: number;
}

const LOW_BALANCE_THRESHOLD = 25;

export function EarningsSummaryCard({ summary, walletBalance }: EarningsSummaryCardProps) {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const { t } = useTranslation();
  const isLowBalance = walletBalance < LOW_BALANCE_THRESHOLD;

  const today = new Date().toLocaleDateString('ar-EG', { weekday: 'long', day: 'numeric', month: 'long' });

  return (
    <View style={styles.card}>
      <Text style={styles.dateLabel}>{today}</Text>
      <View style={styles.gridRow}>
        <View style={styles.kpiBox}>
          <Text style={styles.kpiValue}>{summary.todayDeliveries}</Text>
          <Text style={styles.kpiLabel}>{t('driver.total_deliveries')}</Text>
        </View>
        <View style={styles.kpiBox}>
          <Text style={styles.kpiValue}>{summary.todayNet}</Text>
          <Text style={styles.kpiLabel}>{t('driver.net_earnings_today')} {t('common.egp')}</Text>
        </View>
      </View>
      <View style={[styles.gridRow, { marginTop: 8 }]}>
        <View style={styles.kpiBox}>
          <Text style={styles.kpiValue}>{summary.todayCommission}</Text>
          <Text style={styles.kpiLabel}>{t('driver.commission_paid')} {t('common.egp')}</Text>
        </View>
        <View style={styles.kpiBox}>
          <Text style={styles.kpiValue}>{walletBalance}</Text>
          <Text style={styles.kpiLabel}>Wallet {t('common.egp')}</Text>
        </View>
      </View>
      {isLowBalance && (
        <View style={styles.warningBanner}>
          <Icon name="alert" size={14} color={colors.warning} />
          <Text style={styles.warningText}>{t('driver.low_balance_warning')}</Text>
        </View>
      )}
    </View>
  );
}
