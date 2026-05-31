import React from 'react';
import { FlatList, View } from 'react-native';
import type { AppColors } from '@dawwar/theme';
import { EmptyState, Skeleton } from '@dawwar/ui';
import type { Order } from '@dawwar/types';
import { OrderCard } from '../../../components/OrderCard';
import { createStyles } from '../styles';

interface OrdersListContentProps {
  colors: AppColors;
  orders: Order[];
  isLoading: boolean;
  emptyTitle: string;
  emptySubtitle: string;
  onOrderPress: (orderId: string) => void;
  onRefresh: () => void;
}

export function OrdersListContent({
  colors,
  orders,
  isLoading,
  emptyTitle,
  emptySubtitle,
  onOrderPress,
  onRefresh,
}: OrdersListContentProps) {
  const styles = createStyles(colors);

  if (isLoading) {
    return (
      <View style={styles.skeletonList}>
        {[1, 2, 3].map((item) => (
          <Skeleton
            key={item}
            width="92%"
            height={120}
            style={styles.skeletonCard}
          />
        ))}
      </View>
    );
  }

  if (orders.length === 0) {
    return (
      <EmptyState
        icon="clipboard-list-outline"
        title={emptyTitle}
        subtitle={emptySubtitle}
      />
    );
  }

  return (
    <FlatList<Order>
      data={orders}
      renderItem={({ item }) => (
        <OrderCard
          order={item}
          onPress={() => onOrderPress(item.id)}
        />
      )}
      keyExtractor={(item) => item.id}
      onRefresh={onRefresh}
      refreshing={false}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.listContent}
    />
  );
}
