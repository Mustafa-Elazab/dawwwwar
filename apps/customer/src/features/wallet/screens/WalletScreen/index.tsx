import React, { useMemo } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { useTranslation } from '@dawwar/i18n';
import { ScrollScreenTemplate, Text, LoadingSpinner, ErrorState } from '@dawwar/ui';
import { useTheme } from '@dawwar/theme';
import { BalanceCard } from '../../components/BalanceCard';
import { RechargeChips } from '../../components/RechargeChips';
import { useController } from './useController';
import { createStyles } from './styles';

export function WalletScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);
  const ctrl = useController();

  if (ctrl.isLoading) return <LoadingSpinner fullscreen />;
  if (ctrl.isError) return <ErrorState onRetry={ctrl.refetch} />;

  return (
    <ScrollScreenTemplate
      headerProps={{ 
        title: t('wallet.title'),
        type: 'default'
      }}
      onRefresh={ctrl.refetch}
      refreshing={false}
    >
      <BalanceCard balance={ctrl.balance} />
      <RechargeChips />

      <View style={styles.divider} />

      <View style={styles.historyHeader}>
        <Text style={styles.historyTitle}>{t('wallet.history_title')}</Text>
        <TouchableOpacity onPress={ctrl.handleViewTransactions}>
          <Text style={styles.seeAllText}>{t('home.see_all')}</Text>
        </TouchableOpacity>
      </View>
    </ScrollScreenTemplate>
  );
}
