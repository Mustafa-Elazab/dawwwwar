import React from 'react';
import { ListScreenTemplate, Header } from '@dawwar/ui';
import { TransactionItem } from '../../components/TransactionItem';
import { useController } from './useController';
import type { WalletTransaction } from '@dawwar/types';

export function TransactionsScreen() {
  const ctrl = useController();
  return (
    <ListScreenTemplate<WalletTransaction>
      header={
        <Header title={ctrl.t('wallet.history_title')}
          leftAction={{ icon: 'arrow-left', onPress: ctrl.handleBack }} />
      }
      data={ctrl.transactions}
      renderItem={({ item }) => <TransactionItem transaction={item} />}
      keyExtractor={(item) => item.id}
      isLoading={ctrl.isLoading}
      isError={ctrl.isError}
      onRetry={ctrl.refetch}
      onRefresh={ctrl.refetch}
      refreshing={false}
      emptyIcon="receipt-outline"
      emptyTitle={ctrl.t('wallet.empty_history')}
      emptySubtitle={ctrl.t('wallet.empty_history_sub')}
    />
  );
}
