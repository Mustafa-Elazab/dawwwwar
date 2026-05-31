import React from 'react';
import { ScreenTemplate } from '@dawwar/ui';
import { useTheme } from '@dawwar/theme';
import { OrdersListContent } from './components/OrdersListContent';
import { OrdersTabs } from './components/OrdersTabs';
import { useController } from './useController';

export function OrdersListScreen() {
  const { colors } = useTheme();
  const ctrl = useController();

  return (
    <ScreenTemplate
      headerProps={{ 
        title: ctrl.labels.title,
        type: 'none'
      }}
    >
      <OrdersTabs
        colors={colors}
        tabs={ctrl.tabs}
        activeTab={ctrl.activeTab}
        labels={ctrl.labels.tabs}
        onChange={ctrl.setActiveTab}
      />
      <OrdersListContent
        colors={colors}
        orders={ctrl.orders}
        isLoading={ctrl.isLoading}
        emptyTitle={ctrl.labels.emptyTitle}
        emptySubtitle={ctrl.labels.emptySubtitle}
        onOrderPress={ctrl.handleDetail}
        onRefresh={ctrl.refetch}
      />
    </ScreenTemplate>
  );
}
