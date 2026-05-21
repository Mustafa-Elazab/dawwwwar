import React from 'react';
import { View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { useTheme, microInteractions } from '@dawwar/theme';
import { Text, Icon, AnimatedPressable } from '@dawwar/ui';
import { useTranslation } from '@dawwar/i18n';
import { getDistanceKm, formatDistance } from '../../utils/distance';
import { createStyles } from './styles';
import type { MerchantCardProps } from './types';
import type { StyleProp, ViewStyle } from 'react-native';

export const MerchantCard = React.memo(function MerchantCard({ merchant, onPress, style }: MerchantCardProps & { style?: StyleProp<ViewStyle> }) {
  const { colors } = useTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);
  const { t } = useTranslation();

  const distanceKm = getDistanceKm(
    Number(merchant.latitude),
    Number(merchant.longitude),
  );

  return (
    <AnimatedPressable
      style={[styles.card, style]}
      onPress={onPress}
      pressScale={microInteractions.cardPressScale}
      pressOpacity={microInteractions.pressOpacity}
      pressTranslateY={1}
    >
      <View style={styles.coverContainer}>
        <FastImage
          source={{
            uri: merchant.coverImage ?? merchant.logo ?? 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=1000',
            priority: FastImage.priority.normal,
          }}
          style={styles.cover}
          resizeMode={FastImage.resizeMode.cover}
        />
        {/* Scrim gradient overlay */}
        <View style={styles.scrimTop} />
        <View style={styles.scrimBottom} />

        {/* Status badge */}
        <View style={[styles.badgeOverlay, merchant.isOpen ? styles.openBadge : styles.closedBadge]}>
          <Text style={styles.statusLabel}>{merchant.isOpen ? t('merchant.open') : t('merchant.closed')}</Text>
        </View>

        {/* Delivery time pill */}
        <View style={styles.deliveryPill}>
          <Icon name="clock-outline" size={12} color="#fff" />
          <Text style={styles.deliveryPillText}>
            {merchant.deliveryTimeMin}–{merchant.deliveryTimeMax} {t('common.min')}
          </Text>
        </View>
      </View>

      <View style={styles.body}>
        <View style={styles.titleRow}>
          <Text style={styles.name} numberOfLines={1}>
            {merchant.businessName}
          </Text>
          <View style={styles.ratingChip}>
            <Icon name="star" size={12} color={colors.warning} />
            <Text style={styles.ratingText}>
              {Number(merchant.rating || 0).toFixed(1)}
            </Text>
          </View>
        </View>

        <View style={styles.metaRow}>
          <Icon name="map-marker-outline" size={13} color={colors.textTertiary} />
          <Text style={styles.metaText}>{formatDistance(distanceKm)}</Text>
          <View style={styles.metaDot} />
          <Text style={styles.feeText}>{t('cart.delivery_fee')}</Text>
        </View>
      </View>
    </AnimatedPressable>
  );
});
