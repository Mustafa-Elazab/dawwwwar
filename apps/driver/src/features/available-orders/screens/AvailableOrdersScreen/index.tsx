import React from 'react';
import { View, FlatList } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useTheme } from '@dawwar/theme';
import { Icon } from '../../../../../../../packages/ui/src/atoms/Icon';
import { Text } from '../../../../../../../packages/ui/src/atoms/Text';
import { MapTemplate } from '../../../../../../../packages/ui/src/templates/MapTemplate';
import { OrderType } from '@dawwar/types';
import { mapProvider } from '../../../../core/maps/provider';
import { OnlineToggle } from '../../components/OnlineToggle';
import { OrderPreviewCard } from '../../components/OrderPreviewCard';
import { useController } from './useController';
import type { Order } from '@dawwar/types';
import { createStyles } from './styles';

export function AvailableOrdersScreen() {
  const { colors } = useTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);
  const ctrl = useController();

  const mapInitialRegion = {
    latitude: 30.0444,
    longitude: 31.2357,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  };

  const getPickupCoordinate = (order: Order) => ({
    latitude: order.type === OrderType.CUSTOM
      ? order.shopLatitude ?? order.deliveryLatitude
      : order.merchant?.latitude ?? order.deliveryLatitude,
    longitude: order.type === OrderType.CUSTOM
      ? order.shopLongitude ?? order.deliveryLongitude
      : order.merchant?.longitude ?? order.deliveryLongitude,
  });

  return (
    <MapTemplate
      style={styles.container}
      mapContainerStyle={styles.mapContainer}
      map={
        <MapView
          provider={mapProvider}
          style={styles.map}
          initialRegion={mapInitialRegion}
          showsUserLocation
          showsMyLocationButton={false}
        >
          {ctrl.isOnline && ctrl.orders.map((order: Order) => (
            <Marker
              key={order.id}
              coordinate={getPickupCoordinate(order)}
              title={order.orderNumber}
            >
              <View style={styles.markerContainer}>
                <Icon name="package-variant-closed" size={24} color={colors.primary} />
              </View>
            </Marker>
          ))}
        </MapView>
      }
      contentContainerStyle={styles.overlayLayer}
      contentPointerEvents="box-none"
      content={
        <>
          <View style={styles.topOverlay}>
            <OnlineToggle
              isOnline={ctrl.isOnline}
              onToggle={ctrl.handleToggleOnline}
            />
          </View>

          {ctrl.isOnline ? (
            <View style={styles.bottomOverlay}>
              {ctrl.orders.length > 0 ? (
                <FlatList<Order>
                  data={ctrl.orders}
                  horizontal
                  pagingEnabled
                  showsHorizontalScrollIndicator={false}
                  renderItem={({ item }) => (
                    <View style={styles.orderSlide}>
                      <OrderPreviewCard
                        order={item}
                        onAccept={() => ctrl.handleAccept(item.id)}
                        onDecline={() => ctrl.handleDecline(item.id)}
                        isAccepting={ctrl.acceptingOrderId === item.id}
                      />
                    </View>
                  )}
                  keyExtractor={(item) => item.id}
                  contentContainerStyle={styles.ordersListContent}
                />
              ) : (
                <View style={styles.waitingCard}>
                  <Icon name="timer-sand" size={32} color={colors.primary} />
                  <Text style={styles.waitingText}>{ctrl.t('driver.waiting_for_orders')}</Text>
                </View>
              )}
            </View>
          ) : (
            <View style={styles.offlineCard}>
              <Icon name="motorbike-off" size={40} color={colors.textDisabled} />
              <Text style={styles.offlineText}>{ctrl.t('driver.offline_message')}</Text>
            </View>
          )}
        </>
      }
    />
  );
}
