import React from 'react';
import { View, ScrollView } from 'react-native';
import { ScreenTemplate, Header, LoadingSpinner, Badge, Text } from '@dawwar/ui';
import { useTheme } from '@dawwar/theme';
import { OrderType, OrderStatus } from '@dawwar/types';
import { DeliveryMap } from '../../components/DeliveryMap';
import { StatusActionPanel } from '../../components/StatusActionPanel';
import { ShoppingFlowPanel } from '../../components/ShoppingFlowPanel';
import { CashCollectionCard } from '../../components/CashCollectionCard';
import { useController } from './useController';
import { createStyles } from './styles';

export function ActiveDeliveryScreen() {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const ctrl = useController();

  if (!ctrl.order) return <LoadingSpinner fullscreen />;

  const isCustom = ctrl.order.type === OrderType.CUSTOM;
  const isAtShop = ctrl.order.status === OrderStatus.AT_SHOP;
  const isDelivered = ctrl.order.status === OrderStatus.DELIVERED;

  return (
    <ScreenTemplate
      edges={['top']}
      header={
        <Header
          title={ctrl.order.orderNumber}
          leftAction={{ icon: 'arrow-left', onPress: () => {} }}
        />
      }
      footer={
        !isAtShop && !isDelivered ? (
          <StatusActionPanel
            status={ctrl.order.status}
            orderType={ctrl.order.type}
            isLoading={ctrl.isLoading}
            onNavigate={ctrl.handleNavigate}
            onArrived={ctrl.handleArrived}
            onConfirmPickup={ctrl.handleConfirmPickup}
            onCallContact={ctrl.handleCallContact}
            onConfirmDelivery={ctrl.handleConfirmDelivery}
          />
        ) : null
      }
    >
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Live map */}
        <DeliveryMap
          driverLatitude={ctrl.driverLocation.latitude}
          driverLongitude={ctrl.driverLocation.longitude}
          pickupLatitude={ctrl.order.shopLatitude ?? ctrl.order.merchant?.latitude}
          pickupLongitude={ctrl.order.shopLongitude ?? ctrl.order.merchant?.longitude}
          deliveryLatitude={ctrl.order.deliveryLatitude}
          deliveryLongitude={ctrl.order.deliveryLongitude}
        />

        {/* Order summary card */}
        <View style={styles.orderCard}>
          <Text style={styles.orderNum}>{ctrl.t('orders.order_number', { number: ctrl.order.orderNumber })}</Text>
          <Text style={styles.merchantName}>
            {isCustom ? ctrl.order.shopName ?? ctrl.order.shopAddress : ctrl.order.merchant?.businessName}
          </Text>
          <View style={styles.statusBadgeRow}>
            <Badge
              label={ctrl.t(`tracking.status.${ctrl.order.status}`)}
              variant="info"
              size="sm"
            />
            <Badge
              label={isCustom ? ctrl.t('driver.custom_order') : ctrl.t('driver.regular_order')}
              variant="neutral"
              size="sm"
            />
          </View>
        </View>

        {/* Custom order: shopping flow when AT_SHOP */}
        {isCustom && isAtShop && (
          <ShoppingFlowPanel
            estimatedBudget={ctrl.order.estimatedBudget ?? 0}
            onPhotosCapture={() => {}}
            onSendPhotos={ctrl.handleSendPhotos}
            onActualAmountConfirm={ctrl.handleShoppingConfirm}
            isLoading={ctrl.isLoading}
            photosSent={ctrl.photosSent}
          />
        )}

        {/* Cash collection when DELIVERED */}
        {isDelivered && (
          <>
            <CashCollectionCard
              deliveryFee={ctrl.order.deliveryFee}
              itemsCost={ctrl.order.actualAmount}
              isCustomOrder={isCustom}
            />
            <StatusActionPanel
              status={ctrl.order.status}
              orderType={ctrl.order.type}
              isLoading={ctrl.isLoading}
              onNavigate={ctrl.handleNavigate}
              onArrived={ctrl.handleArrived}
              onConfirmPickup={ctrl.handleConfirmPickup}
              onCallContact={ctrl.handleCallContact}
              onConfirmDelivery={ctrl.handleConfirmDelivery}
            />
          </>
        )}
      </ScrollView>
    </ScreenTemplate>
  );
}
