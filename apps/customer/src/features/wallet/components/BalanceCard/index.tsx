import React from 'react';
import { View } from 'react-native';
import { useTheme } from '@dawwar/theme';
import { Text } from '@dawwar/ui';
import { useTranslation } from '@dawwar/i18n';
import { createStyles } from './styles';

interface BalanceCardProps {
  balance: number;
}

export function BalanceCard({ balance }: BalanceCardProps) {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const { t } = useTranslation();

  return (
    <View style={styles.card}>
      <Text style={styles.label}>{t('wallet.balance_label')}</Text>
      <View style={styles.amountRow}>
        <Text style={styles.amount}>{balance.toFixed(2)}</Text>
        <Text style={styles.currency}>{t('common.egp')}</Text>
      </View>
    </View>
  );
}
