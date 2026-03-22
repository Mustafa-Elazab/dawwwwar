import React from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import { useTheme } from '@dawwar/theme';
import { Text, Badge } from '@dawwar/ui';
import { useTranslation } from '@dawwar/i18n';
import { getDistanceKm, formatDistance } from '../../utils/distance';
import { createStyles } from './styles';
import type { MerchantCardProps } from './types';

export function MerchantCard({ merchant, onPress }: MerchantCardProps) {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const { t } = useTranslation();

  const distanceKm = getDistanceKm(merchant.latitude, merchant.longitude);

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.9}>
      {/* Cover image */}
      <Image
        source={{ uri: merchant.coverImage ?? merchant.logo }}
        style={styles.cover}
        resizeMode="cover"
      />

      {/* Open/Closed badge */}
      <View style={styles.badgeWrapper}>
        <Badge
          label={merchant.isOpen ? t('merchant.open') : t('merchant.closed')}
          variant={merchant.isOpen ? 'success' : 'error'}
          size="sm"
        />
      </View>

      <View style={styles.body}>
        <Text style={styles.name} numberOfLines={1}>
          {merchant.businessName}
        </Text>
        <View style={styles.metaRow}>
          <Text style={styles.ratingText}>{'★'} {merchant.rating.toFixed(1)}</Text>
          <Text style={styles.metaText}>{'·'}</Text>
          <Text style={styles.metaText}>{formatDistance(distanceKm)}</Text>
          <Text style={styles.metaText}>{'·'}</Text>
          <Text style={styles.metaText}>
            {merchant.deliveryTimeMin}–{merchant.deliveryTimeMax} {t('common.min')}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
