import React, { useMemo } from 'react';
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
  const styles = React.useMemo(() => createStyles(colors), [colors]);
  const { t } = useTranslation();

  return (
    <View style={styles.card}>
      <Text style={styles.label}>{t('wallet.balance_label')}</Text>
      <Text style={styles.amount}>
        {Number(balance || 0).toFixed(2)} {t('common.egp')}
      </Text>
    </View>
  );
}
