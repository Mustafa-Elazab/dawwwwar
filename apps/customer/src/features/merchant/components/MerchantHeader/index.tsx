import React, { useMemo } from 'react';
import { View, Image, I18nManager } from 'react-native';
import { useTheme } from '@dawwar/theme';
import { Text, Icon, Badge } from '@dawwar/ui';
import { useTranslation } from '@dawwar/i18n';
import { createStyles } from './styles';
import type { MerchantHeaderProps } from './types';

export function MerchantHeader({ merchant }: MerchantHeaderProps) {
  const { colors } = useTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);
  const { t } = useTranslation();

  return (
    <View style={styles.coverContainer}>
      <Image
        source={{ uri: merchant.coverImage ?? merchant.logo }}
        style={styles.cover}
        resizeMode="cover"
      />
      {/* Dark Overlays */}
      <View style={styles.overlay} />
      <View style={styles.gradient} />

      {/* Floating Info */}
      <View style={styles.headerContent}>
        <Text style={styles.businessName}>{merchant.businessName}</Text>
        <View style={styles.metaRow}>
          <View style={styles.ratingRow}>
            <Icon name="star" size={16} color={colors.warning} />
            <Text style={styles.ratingText}>
              {Number(merchant.rating || 0).toFixed(1)}
            </Text>
          </View>
          <Text style={styles.metaText}>{'·'}</Text>
          <Text style={styles.metaText}>
            {merchant.deliveryTimeMin}–{merchant.deliveryTimeMax} {t('common.min')}
          </Text>
        </View>
        <View style={styles.badgeWrapper}>
          <Badge
            label={merchant.isOpen ? t('merchant.open') : t('merchant.closed')}
            variant={merchant.isOpen ? 'success' : 'error'}
            size="sm"
          />
        </View>
      </View>
    </View>
  );
}
