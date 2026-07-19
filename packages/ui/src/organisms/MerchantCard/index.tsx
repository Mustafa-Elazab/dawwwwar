import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme, radius, spacing } from '@dawwar/theme';
import { AppBadge, AppCard, AppIcon, AppImage, AppText } from '../../atoms';

export interface MerchantCardProps {
  title: string;
  subtitle?: string;
  imageUri?: string;
  rating?: string;
  deliveryTime?: string;
  isOpen?: boolean;
  openLabel?: string;
  closedLabel?: string;
  onPress?: () => void;
  testID?: string;
}

export function MerchantCard({
  title,
  subtitle,
  imageUri,
  rating,
  deliveryTime,
  isOpen,
  openLabel = 'Open',
  closedLabel = 'Closed',
  onPress,
  testID,
}: MerchantCardProps) {
  const { colors } = useTheme();

  return (
    <AppCard style={styles.card} onPress={onPress} testID={testID}>
      <AppImage uri={imageUri} style={styles.image} />
      <View style={styles.body}>
        <View style={styles.titleRow}>
          <AppText variant="label" numberOfLines={1} style={styles.title}>{title}</AppText>
          {typeof isOpen === 'boolean' ? (
            <AppBadge
              label={isOpen ? openLabel : closedLabel}
              variant={isOpen ? 'success' : 'error'}
              size="sm"
            />
          ) : null}
        </View>
        {subtitle ? <AppText variant="caption" color={colors.textSecondary} numberOfLines={1}>{subtitle}</AppText> : null}
        <View style={styles.meta}>
          {rating ? (
            <View style={styles.metaItem}>
              <AppIcon name="star" size={14} color={colors.warning} />
              <AppText variant="caption">{rating}</AppText>
            </View>
          ) : null}
          {deliveryTime ? (
            <View style={styles.metaItem}>
              <AppIcon name="clock-outline" size={14} color={colors.icon} />
              <AppText variant="caption" color={colors.textSecondary}>{deliveryTime}</AppText>
            </View>
          ) : null}
        </View>
      </View>
    </AppCard>
  );
}

const styles = StyleSheet.create({
  card: {
    overflow: 'hidden',
    padding: 0,
  },
  image: {
    width: '100%',
    height: 132,
    borderTopStartRadius: radius.md,
    borderTopEndRadius: radius.md,
  },
  body: {
    padding: spacing[3],
    gap: spacing[2],
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  title: {
    flex: 1,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1],
  },
});
