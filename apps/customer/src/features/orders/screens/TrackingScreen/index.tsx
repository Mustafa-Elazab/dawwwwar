import React from 'react';
import { View } from 'react-native';
import { useTranslation } from '@dawwar/i18n';
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

const MAP_ROADS = [
  { start: '-18%', top: '8%', rotate: '-18deg' },
  { start: '-12%', top: '24%', rotate: '-18deg' },
  { start: '-22%', top: '42%', rotate: '-18deg' },
  { start: '-8%', top: '61%', rotate: '-18deg' },
  { start: '-18%', top: '78%', rotate: '-18deg' },
  { start: '24%', top: '-12%', rotate: '68deg' },
  { start: '46%', top: '-8%', rotate: '68deg' },
  { start: '68%', top: '-12%', rotate: '68deg' },
] as const;

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
      headerProps={{
        title: t('tracking.title', 'Order Tracking'),
      }}
    >
      <View style={styles.mapPanel}>
        <View style={styles.mapGrid}>
          {MAP_ROADS.map((road, index) => (
            <View
              key={index}
              style={[
                styles.mapRoad,
                {
                  start: road.start,
                  top: road.top,
                  transform: [{ rotate: road.rotate }],
                },
              ]}
            />
          ))}
        </View>
        <View style={styles.routeBase} />
        <View style={[styles.routeActive, { height: ctrl.hasDriver ? '66%' : '28%' }]} />
        <View style={styles.storePin}>
          <Icon name="storefront" size={22} color={colors.primary} />
        </View>
        <View style={styles.driverPin}>
          <Icon name="account" size={24} color={colors.primary} />
        </View>
        <TouchableIcon style={styles.locateBtn}>
          <Icon name="crosshairs-gps" size={20} color={colors.text} />
        </TouchableIcon>
      </View>

      {/* Driver card */}
      <View style={styles.driverCard}>
        <Icon
          name={ctrl.hasDriver ? 'account-circle-outline' : 'account-search-outline'}
          size={44}
          color={colors.primary}
        />
        <View style={styles.driverInfo}>
          <Text style={styles.driverName}>
            {ctrl.hasDriver ? t('tracking.driver_assigned') : t('tracking.finding_driver')}
          </Text>
          <Text style={styles.driverMeta}>
            {ctrl.hasDriver ? ctrl.order.orderNumber : t(`tracking.status.${ctrl.order.status}`)}
          </Text>
        </View>
        {ctrl.hasDriver ? (
          <View style={styles.driverActions}>
            <View style={styles.callBtn}>
              <Icon name="message-outline" size={18} color={colors.text} />
            </View>
            <View style={styles.callBtn}>
              <Icon name="phone" size={18} color={colors.text} />
            </View>
          </View>
        ) : null}
      </View>

      <View style={styles.timelineContainer}>
        <StatusTimeline status={ctrl.order.status} orderType={ctrl.order.type} />
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>{t('tracking.estimated_delivery_time', 'Estimated Delivery Time')}</Text>
        <Text style={styles.infoValue}>10:25</Text>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>{t('tracking.my_order', 'My Order')}</Text>
        <Text style={styles.detailsLink} onPress={ctrl.handleViewDetails}>
          {t('orders.view_details')}
        </Text>
      </View>

      {/* Cancel button — only PENDING or ACCEPTED */}
      {ctrl.canCancel && (
        <Button
          label={t('tracking.cancel_order')}
          variant="outline"
          style={styles.cancelBtn}
          onPress={ctrl.handleCancelOrder}
        />
      )}
    </ScrollScreenTemplate>
  );
}

function TouchableIcon({ children, style }: any) {
  return <View style={style}>{children}</View>;
}
