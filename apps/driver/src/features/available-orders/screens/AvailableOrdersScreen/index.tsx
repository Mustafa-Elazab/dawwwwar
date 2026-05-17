import React, { useMemo } from 'react';
import { View, FlatList, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import { useTheme, space, radius, shadows, typography } from '@dawwar/theme';
import { Text, Icon, LoadingSpinner, Badge } from '@dawwar/ui';
import { OnlineToggle } from '../../components/OnlineToggle';
import { OrderPreviewCard } from '../../components/OrderPreviewCard';
import { useController } from './useController';
import type { Order } from '@dawwar/types';

const { width, height } = Dimensions.get('window');

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

  return (
    <View style={styles.container}>
      {/* Map Background */}
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={mapInitialRegion}
        showsUserLocation
        showsMyLocationButton={false}
      >
        {ctrl.isOnline && ctrl.orders.map((order: Order) => (
          <Marker
            key={order.id}
            coordinate={{ 
              latitude: order.merchant?.latitude ?? order.deliveryLatitude, 
              longitude: order.merchant?.longitude ?? order.deliveryLongitude 
            }}
            title={order.orderNumber}
          >
            <View style={styles.markerContainer}>
              <Icon name="package-variant-closed" size={24} color={colors.primary} />
            </View>
          </Marker>
        ))}
      </MapView>

      {/* Top Overlay: Online Toggle */}
      <View style={styles.topOverlay}>
        <OnlineToggle
          isOnline={ctrl.isOnline}
          onToggle={ctrl.handleToggleOnline}
        />
      </View>

      {/* Bottom Overlay: Orders List or Status */}
      {ctrl.isOnline ? (
        <View style={styles.bottomOverlay}>
          {ctrl.orders.length > 0 ? (
            <FlatList<Order>
              data={ctrl.orders}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => (
                <View style={{ width: width - space.base * 2, marginHorizontal: space.xs }}>
                  <OrderPreviewCard
                    order={item}
                    onAccept={() => ctrl.handleAccept(item.id)}
                    onDecline={() => ctrl.handleDecline(item.id)}
                    isAccepting={ctrl.acceptingOrderId === item.id}
                  />
                </View>
              )}
              keyExtractor={(item) => item.id}
              contentContainerStyle={{ paddingHorizontal: space.sm }}
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
    </View>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  container: { flex: 1 },
  map: { ...StyleSheet.absoluteFillObject },
  topOverlay: {
    position: 'absolute',
    top: 50,
    left: space.base,
    right: space.base,
    zIndex: 10,
  },
  bottomOverlay: {
    position: 'absolute',
    bottom: 20,
    left: space.xs,
    right: space.xs,
    zIndex: 10,
  },
  markerContainer: {
    padding: 6,
    backgroundColor: '#fff',
    borderRadius: 20,
    ...shadows.sm,
  },
  waitingCard: {
    backgroundColor: colors.surface,
    margin: space.sm,
    padding: space.lg,
    borderRadius: radius.lg,
    alignItems: 'center',
    flexDirection: 'row',
    gap: space.md,
    ...shadows.md,
  },
  waitingText: { ...typography.h4, color: colors.text },
  offlineCard: {
    position: 'absolute',
    bottom: 40,
    left: space.base,
    right: space.base,
    backgroundColor: colors.surface,
    padding: space.xl,
    borderRadius: radius.lg,
    alignItems: 'center',
    gap: space.md,
    ...shadows.lg,
  },
  offlineText: { ...typography.body1, color: colors.textSecondary, textAlign: 'center' },
});
