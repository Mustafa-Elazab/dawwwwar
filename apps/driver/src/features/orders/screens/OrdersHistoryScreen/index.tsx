import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { useTheme, space } from '@dawwar/theme';
import { EmptyState } from '../../../../../../../packages/ui/src/molecules/EmptyState';
import { ErrorState } from '../../../../../../../packages/ui/src/molecules/ErrorState';
import { LoadingSpinner } from '../../../../../../../packages/ui/src/molecules/LoadingSpinner';
import { Header } from '../../../../../../../packages/ui/src/organisms/Header';
import { ScreenTemplate } from '../../../../../../../packages/ui/src/templates/ScreenTemplate';
import { OrderCard } from '../../components/OrderCard';
import { useController } from './useController';
import type { Order } from '@dawwar/types';

export function OrdersHistoryScreen() {
  const { colors } = useTheme();
  const ctrl = useController();

  const renderItem = React.useCallback(({ item }: { item: Order }) => (
    <OrderCard order={item} />
  ), []);

  if (ctrl.isLoading) return <LoadingSpinner fullscreen />;
  if (ctrl.isError) return <ErrorState onRetry={ctrl.refetch} />;

  return (
    <ScreenTemplate edges={['top']} backgroundColor={colors.background}>
      <Header title={ctrl.t('driver.order_history')} />
      <FlatList<Order>
        data={ctrl.orders}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        onRefresh={ctrl.refetch}
        refreshing={false}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <EmptyState
            icon="clipboard-text-outline"
            title={ctrl.t('driver.empty_history')}
            subtitle={ctrl.t('driver.empty_history_sub')}
          />
        }
      />
    </ScreenTemplate>
  );
}

const styles = StyleSheet.create({
  listContent: {
    padding: space.base,
    flexGrow: 1,
  },
});
