import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme, space, radius, shadows, typography } from '@dawwar/theme';
import { Text, Badge, Icon } from '@dawwar/ui';
import { useTranslation } from '@dawwar/i18n';
import type { Order } from '@dawwar/types';

interface OrderCardProps {
  order: Order;
  onPress?: () => void;
}

export const OrderCard = React.memo(({ order, onPress }: OrderCardProps) => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const styles = React.useMemo(() => createStyles(colors), [colors]);

  const date = new Date(order.createdAt).toLocaleDateString('ar-EG', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.85}
      disabled={!onPress}
    >
      <View style={styles.header}>
        <Text style={styles.orderNumber}>{order.orderNumber}</Text>
        <Badge
          label={t(`status.${order.status.toLowerCase()}`, { defaultValue: order.status })}
          variant={order.status === 'COMPLETED' ? 'success' : 'neutral'}
          size="sm"
        />
      </View>

      <View style={styles.body}>
        <View style={styles.row}>
          <Icon name="map-marker-outline" size={16} color={colors.textSecondary} />
          <Text style={styles.address} numberOfLines={1}>
            {order.deliveryAddress}
          </Text>
        </View>
        <View style={styles.footer}>
          <Text style={styles.date}>{date}</Text>
          <Text style={styles.amount}>
            {order.deliveryFee} {t('common.egp')}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
});

const createStyles = (colors: any) =>
  StyleSheet.create({
    card: {
      backgroundColor: colors.surface,
      borderRadius: radius.md,
      padding: space.base,
      marginBottom: space.sm,
      ...shadows.sm,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: space.sm,
    },
    orderNumber: { ...typography.h4, color: colors.text },
    body: { gap: space.xs },
    row: { flexDirection: 'row', alignItems: 'center', gap: space.xs },
    address: { ...typography.body2, color: colors.textSecondary, flex: 1 },
    footer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: space.xs,
      paddingTop: space.xs,
      borderTopWidth: 1,
      borderTopColor: colors.borderLight,
    },
    date: { ...typography.caption, color: colors.textDisabled },
    amount: { ...typography.label, color: colors.primary, fontWeight: '700' },
  });
