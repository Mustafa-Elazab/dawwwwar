import React from 'react';
import { View } from 'react-native';
import {
  ScrollScreenTemplate,
  Header,
  Text,
  Button,
  LoadingSpinner,
  ErrorState,
  Icon,
} from '@dawwar/ui';
import { useTheme } from '@dawwar/theme';
import { StatusTimeline } from '../../components/StatusTimeline';
import { useController } from './useController';
import { createStyles } from './styles';

export function TrackingScreen() {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const ctrl = useController();

  if (ctrl.isLoading) {
    return <LoadingSpinner fullscreen />;
  }
  if (ctrl.isError || !ctrl.order) {
    return <ErrorState />;
  }

  return (
    <ScrollScreenTemplate
      edges={['top', 'bottom']}
      header={
        <Header
          title={ctrl.t('orders.order_number', { number: ctrl.order.orderNumber })}
        />
      }
    >
      {/* Status timeline */}
      <View style={styles.timelineContainer}>
        <StatusTimeline status={ctrl.order.status} orderType={ctrl.order.type} />
        <Text style={styles.statusLabel}>
          {ctrl.t(`tracking.status.${ctrl.order.status}`)}
        </Text>
      </View>

      {/* Map placeholder — Phase 1 uses grey view, Phase 2 wires MapView */}
      {ctrl.driverLocation && (
        <View style={styles.mapPlaceholder}>
          <Icon name="map-marker-radius-outline" size={32} color={colors.primary} />
          <Text style={styles.mapPlaceholderText}>
            {`${ctrl.driverLocation.latitude.toFixed(4)}, ${ctrl.driverLocation.longitude.toFixed(4)}`}
          </Text>
        </View>
      )}

      {/* Driver card */}
      {ctrl.hasDriver && (
        <View style={styles.driverCard}>
          <Icon name="account-circle-outline" size={44} color={colors.primary} />
          <View style={styles.driverInfo}>
            <Text style={styles.driverName}>{ctrl.t('driver.on_the_way')}</Text>
            <Text style={styles.driverMeta}>
              {ctrl.order.orderNumber}
            </Text>
          </View>
          <View style={styles.callBtn}>
            <Icon name="phone" size={20} color={colors.primary} />
          </View>
        </View>
      )}

      {/* Cancel button — only PENDING or ACCEPTED */}
      {ctrl.canCancel && (
        <Button
          label={ctrl.t('tracking.cancel_order')}
          variant="outline"
          style={styles.cancelBtn}
        />
      )}
    </ScrollScreenTemplate>
  );
}
