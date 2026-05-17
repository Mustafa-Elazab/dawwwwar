import React, { useCallback } from 'react';
import { useTranslation } from '@dawwar/i18n';
import { ListScreenTemplate } from '@dawwar/ui';
import { useTheme } from '@dawwar/theme';
import { useController } from './useController';
import type { Merchant } from '@dawwar/types';
import { MerchantCard } from '../../components/MerchantCard';
import { Dimensions } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export function NearbyMerchantsScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const ctrl = useController();

  const renderItem = useCallback(
    ({ item }: { item: Merchant }) => (
      <MerchantCard
        merchant={item}
        onPress={() => ctrl.handleMerchantPress(item.id)}
        style={{ width: SCREEN_WIDTH - 32, marginBottom: 12, marginHorizontal: 16 }}
      />
    ),
    [ctrl.handleMerchantPress]
  );

  return (
    <ListScreenTemplate<Merchant>
      edges={['top']}
      headerProps={{
        title: t('home.nearby_title'),
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
      emptyTitle={t('home.no_merchants')}
      emptySubtitle={t('home.no_merchants_sub')}
    />
  );
}
