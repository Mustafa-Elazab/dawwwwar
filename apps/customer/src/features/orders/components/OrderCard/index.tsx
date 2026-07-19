import React from 'react';
import { I18nManager, Image, TouchableOpacity, View } from 'react-native';
import { useTheme } from '@dawwar/theme';
import { Text, Badge, Icon } from '@dawwar/ui';
import { useTranslation } from '@dawwar/i18n';
import { OrderType } from '@dawwar/types';
import { createStyles } from './styles';
import type { OrderCardProps } from './types';

function getStatusVariant(status: string) {
  if (['COMPLETED', 'DELIVERED'].includes(status)) return 'success';
  if (['REJECTED', 'CANCELLED'].includes(status)) return 'error';
  if (['PENDING', 'ACCEPTED'].includes(status)) return 'warning';
  return 'info';
}

export const OrderCard = React.memo(function OrderCard({ order, onPress }: OrderCardProps) {
  const { colors } = useTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);
  const { t, i18n } = useTranslation();

  const isCustom = order.type === OrderType.CUSTOM;
  const firstItem = order.items?.[0];
  const itemName = firstItem
    ? (i18n.language.startsWith('ar') ? firstItem.productNameAr || firstItem.productName : firstItem.productName)
    : isCustom
      ? order.itemsDescription || t('orders.custom_order')
      : t('orders.regular_order');
  const imageUri =
    order.merchant?.logo ||
    order.merchant?.coverImage ||
    order.itemsImages?.[0] ||
    'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=1000';

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.86}>
      <Image source={{ uri: imageUri }} style={styles.image} resizeMode="cover" />
      <View style={styles.content}>
        <View style={styles.topRow}>
          <Text style={styles.orderNum}>{t('orders.order_number', { number: order.orderNumber })}</Text>
          <Badge
            label={t(`tracking.status.${order.status}`)}
            variant={getStatusVariant(order.status)}
            size="sm"
            style={styles.statusBadge}
          />
        </View>

        <Text style={styles.itemName} numberOfLines={1}>{itemName}</Text>

        <View style={styles.metaRow}>
          <Text style={styles.totalText}>{order.total} {t('common.egp')}</Text>
          <Text style={styles.metaText}>·</Text>
          <Text style={styles.metaText}>
            {new Date(order.createdAt).toLocaleDateString(i18n.language.startsWith('ar') ? 'ar-EG' : 'en-US')}
          </Text>
        </View>
      </View>
      <View style={styles.chevron}>
        <Icon
          name={I18nManager.isRTL ? 'chevron-left' : 'chevron-right'}
          size={22}
          color={colors.textTertiary}
        />
      </View>
    </TouchableOpacity>
  );
});
