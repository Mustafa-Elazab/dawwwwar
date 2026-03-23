import React from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import { useTheme } from '@dawwar/theme';
import { Text, Icon, Badge } from '@dawwar/ui';
import { useTranslation } from '@dawwar/i18n';
import { createStyles } from './styles';
import type { MerchantHeaderProps } from './types';

export function MerchantHeader({ merchant, onBack }: MerchantHeaderProps) {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const { t } = useTranslation();

  return (
    <>
      {/* Cover image */}
      <View style={styles.coverContainer}>
        <Image
          source={{ uri: merchant.coverImage ?? merchant.logo }}
          style={styles.cover}
          resizeMode="cover"
        />
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <Icon name="arrow-left" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Info card — overlaps cover bottom with rounded corners */}
      <View style={styles.infoCard}>
        <View style={styles.logoRow}>
          <Image
            source={{ uri: merchant.logo }}
            style={styles.logo}
            resizeMode="cover"
          />
          <View style={styles.nameBlock}>
            <Text style={styles.businessName}>{merchant.businessName}</Text>
            <View style={styles.metaRow}>
              <Text style={styles.ratingText}>{'★'} {merchant.rating.toFixed(1)}</Text>
              <Text style={styles.metaText}>
                {'('}{merchant.totalRatings} {t('merchant.tab_reviews')}{')'}
              </Text>
            </View>
            <View style={styles.metaRow}>
              <Text style={styles.metaText}>
                {merchant.deliveryTimeMin}–{merchant.deliveryTimeMax} {t('common.min')}
              </Text>
              <Text style={styles.metaText}>{'·'}</Text>
              {merchant.isOpen ? (
                <Badge label={t('merchant.open')} variant="success" size="sm" />
              ) : (
                <Text style={styles.closedText}>{t('merchant.closed')}</Text>
              )}
            </View>
          </View>
        </View>
      </View>
    </>
  );
}
