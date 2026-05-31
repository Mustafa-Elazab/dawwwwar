import React from 'react';
import { ListScreenTemplate } from '@dawwar/ui';
import { MerchantListRow } from './components/MerchantListRow';
import { useController } from './useController';
import type { Merchant } from '@dawwar/types';

export function CategoryMerchantsScreen() {
  const ctrl = useController();

  const renderItem = React.useCallback(
    ({ item }: { item: Merchant }) => (
      <MerchantListRow
        merchant={item}
        openLabel={ctrl.labels.open}
        closedLabel={ctrl.labels.closed}
        minutesLabel={ctrl.labels.minutes}
        onPress={ctrl.handleMerchantPress}
      />
    ),
    [ctrl.handleMerchantPress, ctrl.labels.closed, ctrl.labels.minutes, ctrl.labels.open],
  );

  return (
    <ListScreenTemplate<Merchant>
      edges={['top']}
      headerProps={{
        title: ctrl.categoryName,
        onBackPress: ctrl.handleBack,
      }}
      data={ctrl.merchants}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      isLoading={ctrl.isLoading}
      isError={ctrl.isError}
      onRetry={ctrl.refetch}
      onRefresh={ctrl.refetch}
      refreshing={false}
      emptyTitle={ctrl.labels.emptyTitle}
      emptySubtitle={ctrl.labels.emptySubtitle}
    />
  );
}
