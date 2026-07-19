import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme, radius, spacing } from '@dawwar/theme';
import { AppCard, AppIcon, AppImage, AppPressable, AppText } from '../../atoms';

export interface ProductCardProps {
  title: string;
  subtitle?: string;
  imageUri?: string;
  price: string;
  oldPrice?: string;
  liked?: boolean;
  onPress?: () => void;
  onToggleLike?: () => void;
  testID?: string;
}

export function ProductCard({
  title,
  subtitle,
  imageUri,
  price,
  oldPrice,
  liked,
  onPress,
  onToggleLike,
  testID,
}: ProductCardProps) {
  const { colors } = useTheme();

  return (
    <AppCard style={styles.card} onPress={onPress} testID={testID}>
      <View>
        <AppImage uri={imageUri} style={styles.image} />
        <AppPressable
          style={[styles.like, { backgroundColor: colors.surface }]}
          onPress={onToggleLike}
        >
          <AppIcon
            name={liked ? 'heart' : 'heart-outline'}
            size={18}
            color={colors.primary}
          />
        </AppPressable>
      </View>
      <View style={styles.body}>
        <AppText variant="label" numberOfLines={1}>{title}</AppText>
        {subtitle ? <AppText variant="caption" color={colors.textSecondary} numberOfLines={1}>{subtitle}</AppText> : null}
        <View style={styles.priceRow}>
          {oldPrice ? (
            <AppText variant="caption" color={colors.textTertiary} style={styles.oldPrice}>{oldPrice}</AppText>
          ) : null}
          <AppText variant="label" color={colors.primary}>{price}</AppText>
        </View>
      </View>
    </AppCard>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 0,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 112,
    borderTopStartRadius: radius.md,
    borderTopEndRadius: radius.md,
  },
  like: {
    position: 'absolute',
    top: spacing[2],
    end: spacing[2],
    width: 34,
    height: 34,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    padding: spacing[3],
    gap: spacing[1],
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  oldPrice: {
    textDecorationLine: 'line-through',
  },
});
