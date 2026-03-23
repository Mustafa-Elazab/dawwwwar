import React from 'react';
import { ListScreenTemplate, Header, ListItem, Avatar, Badge } from '@dawwar/ui';
import { useTheme } from '@dawwar/theme';
import { useController } from './useController';
import type { Merchant } from '@dawwar/types';

export function CategoryMerchantsScreen() {
  const { colors } = useTheme();
  const ctrl = useController();

  return (
    <ListScreenTemplate<Merchant>
      edges={['top']}
      header={
        <Header
          title={ctrl.categoryName}
          leftAction={{ icon: 'arrow-left', onPress: ctrl.handleBack }}
        />
      }
      data={ctrl.merchants}
      renderItem={({ item }) => (
        <ListItem
          title={item.businessName}
          subtitle={`★ ${item.rating.toFixed(1)}  ·  ${item.deliveryTimeMin}–${item.deliveryTimeMax} min`}
          leftElement={<Avatar uri={item.logo} name={item.businessName} size="md" />}
          rightElement={
            <Badge
              label={item.isOpen ? ctrl.t('merchant.open') : ctrl.t('merchant.closed')}
              variant={item.isOpen ? 'success' : 'error'}
              size="sm"
            />
          }
          onPress={() => ctrl.handleMerchantPress(item.id)}
        />
      )}
      keyExtractor={(item) => item.id}
      isLoading={ctrl.isLoading}
      isError={ctrl.isError}
      onRetry={ctrl.refetch}
      onRefresh={ctrl.refetch}
      refreshing={false}
      emptyTitle={ctrl.t('categories.no_results')}
      emptySubtitle={ctrl.t('categories.no_results_sub')}
    />
  );
}
