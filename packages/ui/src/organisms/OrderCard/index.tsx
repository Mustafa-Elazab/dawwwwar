import React from 'react';
import { I18nManager, StyleSheet, View } from 'react-native';
import { useTheme, radius, spacing } from '@dawwar/theme';
import { AppBadge, AppCard, AppIcon, AppImage, AppText } from '../../atoms';

export interface OrderCardProps {
  orderNumber: string;
  title: string;
  subtitle?: string;
  imageUri?: string;
  total: string;
  status: string;
  statusTone?: 'success' | 'error' | 'warning' | 'info';
  onPress?: () => void;
}

export function OrderCard({
  orderNumber,
  title,
  subtitle,
  imageUri,
  total,
  status,
  statusTone = 'info',
  onPress,
}: OrderCardProps) {
  const { colors } = useTheme();

  return (
    <AppCard style={styles.card} onPress={onPress}>
      <AppImage uri={imageUri} style={styles.image} />
      <View style={styles.body}>
        <View style={styles.topRow}>
          <AppText variant="caption" color={colors.textSecondary} numberOfLines={1}>{orderNumber}</AppText>
          <AppBadge label={status} variant={statusTone} size="sm" />
        </View>
        <AppText variant="label" numberOfLines={1}>{title}</AppText>
        {subtitle ? <AppText variant="caption" color={colors.textSecondary} numberOfLines={1}>{subtitle}</AppText> : null}
        <AppText variant="label" color={colors.primary}>{total}</AppText>
      </View>
      <AppIcon name="chevron-right" size={22} color={colors.icon} style={styles.chevron} />
    </AppCard>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
  },
  image: {
    width: 64,
    height: 64,
    borderRadius: radius.md,
  },
  body: {
    flex: 1,
    gap: spacing[1],
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing[2],
  },
  chevron: {
    transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }],
  },
});
