import React from 'react';
import { View } from 'react-native';
import { useTheme } from '@dawwar/theme';
import { Text, Badge, Button } from '@dawwar/ui';
import { useTranslation } from '@dawwar/i18n';
import { OrderType, ACTIVE_ORDER_STATUSES } from '@dawwar/types';
import { createStyles } from './styles';
import type { OrderCardProps } from './types';

function getStatusVariant(status: string) {
  if (['COMPLETED', 'DELIVERED'].includes(status)) return 'success';
  if (['REJECTED', 'CANCELLED'].includes(status)) return 'error';
  if (['PENDING', 'ACCEPTED'].includes(status)) return 'warning';
  return 'info';
}

export function OrderCard({ order, onTrack, onViewDetail }: OrderCardProps) {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const { t } = useTranslation();

  const isActive = ACTIVE_ORDER_STATUSES.includes(order.status);
  const isCustom = order.type === OrderType.CUSTOM;

  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <Text style={styles.orderNum}>{t('orders.order_number', { number: order.orderNumber })}</Text>
        <Badge
          label={t(`tracking.status.${order.status}`)}
          variant={getStatusVariant(order.status)}
          size="sm"
        />
      </View>

      <View style={styles.metaRow}>
        <Badge
          label={isCustom ? t('orders.custom_order') : t('orders.regular_order')}
          variant="neutral"
          size="sm"
        />
        <Text style={styles.metaText}>·</Text>
        <Text style={styles.totalText}>{order.total} {t('common.egp')}</Text>
        <Text style={styles.metaText}>·</Text>
        <Text style={styles.metaText}>
          {new Date(order.createdAt).toLocaleDateString('ar-EG')}
        </Text>
      </View>

      <View style={styles.actionRow}>
        {isActive ? (
          <Button
            label={t('orders.track')}
            onPress={onTrack}
            variant="primary"
            size="sm"
            style={styles.trackBtn}
          />
        ) : null}
        <Button
          label={t('orders.view_details')}
          onPress={onViewDetail}
          variant="outline"
          size="sm"
          style={styles.detailBtn}
        />
      </View>
    </View>
  );
}
