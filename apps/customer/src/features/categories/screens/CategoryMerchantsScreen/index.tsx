import React from 'react';
import { useTranslation } from '@dawwar/i18n';
import { ListScreenTemplate, ListItem, Avatar, Badge } from '@dawwar/ui';
import { useTheme } from '@dawwar/theme';
import { useController } from './useController';
import type { Merchant } from '@dawwar/types';

export function CategoryMerchantsScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const ctrl = useController();

  const renderItem = React.useCallback(
    ({ item }: { item: Merchant }) => (
      <ListItem
        title={item.businessName}
        subtitle={`★ ${Number(item.rating || 0).toFixed(1)}  ·  ${item.deliveryTimeMin}–${item.deliveryTimeMax} min`}
        leftElement={<Avatar uri={item.logo} name={item.businessName} size="md" />}
        rightElement={
          <Badge
            label={item.isOpen ? t('merchant.open') : t('merchant.closed')}
            variant={item.isOpen ? 'success' : 'error'}
            size="sm"
          />
        }
        onPress={() => ctrl.handleMerchantPress(item.id)}
      />
    ),
    [ctrl.handleMerchantPress, t]
  );

  return (
    <ListScreenTemplate<Merchant>
      edges={['top']}
      headerProps={{
        title: ctrl.categoryName,
      }}
      data={ctrl.merchants}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      isLoading={ctrl.isLoading}
      isError={ctrl.isError}
      onRetry={ctrl.refetch}
      onRefresh={ctrl.refetch}
      refreshing={false}
      emptyTitle={t('categories.no_results')}
      emptySubtitle={t('categories.no_results_sub')}
    />
  );
}
