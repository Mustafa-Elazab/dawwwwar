import React, { useMemo } from 'react';
import { View, TouchableOpacity, Image, I18nManager } from 'react-native';
import { useTheme } from '@dawwar/theme';
import { Text, Badge, Icon } from '@dawwar/ui';
import { useTranslation } from '@dawwar/i18n';
import { getDistanceKm, formatDistance } from '../../utils/distance';
import { createStyles } from './styles';
import type { MerchantCardProps } from './types';

export const MerchantCard = React.memo(function MerchantCard({ merchant, onPress, isLiked, onToggleLike, style }: MerchantCardProps & { style?: any }) {
  const { colors } = useTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);
  const { t } = useTranslation();

  const distanceKm = getDistanceKm(
    Number(merchant.latitude),
    Number(merchant.longitude),
  );

  return (
    <TouchableOpacity style={[styles.card, style]} onPress={onPress} activeOpacity={0.9}>
      <View style={styles.coverContainer}>
        <Image
          source={{ uri: merchant.coverImage ?? merchant.logo ?? 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=1000' }}
          style={styles.cover}
          resizeMode="cover"
        />
        {/* Gradient Overlay */}
        <View style={styles.gradient} />
        
        {/* Open/Closed badge inside cover */}
        <View style={styles.badgeOverlay}>
          <Badge
            label={merchant.isOpen ? t('merchant.open') : t('merchant.closed')}
            variant={merchant.isOpen ? 'success' : 'error'}
            size="sm"
          />
        </View>
        {onToggleLike ? (
          <TouchableOpacity style={styles.likeButton} onPress={onToggleLike}>
            <Icon name={isLiked ? 'heart' : 'heart-outline'} size={20} color={colors.primary} />
          </TouchableOpacity>
        ) : null}
      </View>

      <View style={styles.body}>
        <Text style={styles.name} numberOfLines={1}>
          {merchant.businessName}
        </Text>
        <View style={styles.metaRow}>
          <View style={styles.ratingRow}>
            <Icon name="star" size={14} color={colors.warning} />
            <Text style={styles.ratingText}>
              {Number(merchant.rating || 0).toFixed(1)}
            </Text>
          </View>
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
});
