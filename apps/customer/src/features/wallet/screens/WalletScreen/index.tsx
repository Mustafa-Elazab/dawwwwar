import React, { useMemo } from 'react';
import { View } from 'react-native';
import { useTranslation } from '@dawwar/i18n';
import { ScrollScreenTemplate, Text, LoadingSpinner, ErrorState, AnimatedPressable, EmptyState } from '@dawwar/ui';
import { microInteractions, useTheme } from '@dawwar/theme';
import { BalanceCard } from '../../components/BalanceCard';
import { RechargeChips } from '../../components/RechargeChips';
import { TransactionItem } from '../../components/TransactionItem';
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
        <AnimatedPressable
          onPress={ctrl.handleViewTransactions}
          pressScale={microInteractions.pressScale}
          pressOpacity={microInteractions.pressOpacity}
          pressTranslateY={1}
        >
          <Text style={styles.seeAllText}>{t('home.see_all')}</Text>
        </AnimatedPressable>
      </View>

      <View style={styles.historyCard}>
        {ctrl.recentTransactions.length === 0 ? (
          <EmptyState
            icon="receipt-outline"
            title={t('wallet.empty_history')}
            subtitle={t('wallet.empty_history_sub')}
          />
        ) : (
          ctrl.recentTransactions.map((transaction) => (
            <TransactionItem key={transaction.id} transaction={transaction} />
          ))
        )}
      </View>
    </ScrollScreenTemplate>
  );
}
