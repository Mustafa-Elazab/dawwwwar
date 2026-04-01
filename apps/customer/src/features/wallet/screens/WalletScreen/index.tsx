import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { ScrollScreenTemplate, Header, Text, LoadingSpinner, ErrorState } from '@dawwar/ui';
import { useTheme } from '@dawwar/theme';
import { BalanceCard } from '../../components/BalanceCard';
import { RechargeChips } from '../../components/RechargeChips';
import { useController } from './useController';
import { createStyles } from './styles';

export function WalletScreen() {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const ctrl = useController();

  if (ctrl.isLoading) return <LoadingSpinner fullscreen />;
  if (ctrl.isError) return <ErrorState onRetry={ctrl.refetch} />;

  return (
    <ScrollScreenTemplate
      edges={['top']}
      header={<Header title={ctrl.t('wallet.title')} />}
      onRefresh={ctrl.refetch}
      refreshing={false}
    >
      <BalanceCard balance={ctrl.balance} />
      <RechargeChips />

      <View style={styles.historyHeader}>
        <Text style={styles.historyTitle}>{ctrl.t('wallet.history_title')}</Text>
        <TouchableOpacity onPress={ctrl.handleViewTransactions}>
          <Text style={styles.seeAllText}>{ctrl.t('home.see_all')}</Text>
        </TouchableOpacity>
      </View>
    </ScrollScreenTemplate>
  );
}
