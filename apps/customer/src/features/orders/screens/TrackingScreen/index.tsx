import React, { useMemo } from 'react';
import { View } from 'react-native';
import { useTranslation } from '@dawwar/i18n';
import MapView, { Marker } from 'react-native-maps';
import {
  ScrollScreenTemplate,
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
  const { t } = useTranslation();
  const { colors } = useTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);
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
      headerProps={{
        title: t('orders.order_number', { number: ctrl.order.orderNumber }),
      }}
    >
      {/* Status timeline */}
      <View style={styles.timelineContainer}>
        <StatusTimeline status={ctrl.order.status} orderType={ctrl.order.type} />
        <Text style={styles.statusLabel}>
          {t(`tracking.status.${ctrl.order.status}`)}
        </Text>
      </View>

      {/* Map implementation */}
      {ctrl.driverLocation && (
        <MapView
          style={styles.mapPlaceholder}
          region={{
            latitude: ctrl.driverLocation.latitude,
            longitude: ctrl.driverLocation.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
          scrollEnabled={false}
          zoomEnabled={false}
        >
          <Marker
            coordinate={ctrl.driverLocation}
            title={t('driver.on_the_way')}
          >
            <Icon name="motorbike" size={28} color={colors.primary} />
          </Marker>
        </MapView>
      )}

      {/* Driver card */}
      {ctrl.hasDriver && (
        <View style={styles.driverCard}>
          <Icon name="account-circle-outline" size={44} color={colors.primary} />
          <View style={styles.driverInfo}>
            <Text style={styles.driverName}>{t('driver.on_the_way')}</Text>
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
          label={t('tracking.cancel_order')}
          variant="outline"
          style={styles.cancelBtn}
          onPress={() => {}}
        />
      )}
    </ScrollScreenTemplate>
  );
}
