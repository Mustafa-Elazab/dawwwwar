import React from 'react';
import { View, I18nManager } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme, microInteractions } from '@dawwar/theme';
import { Text, Icon, Badge, AnimatedPressable } from '@dawwar/ui';
import { useTranslation } from '@dawwar/i18n';
import FastImage from 'react-native-fast-image';
import { createStyles } from './styles';
import type { MerchantHeaderProps } from './types';

export function MerchantHeader({ merchant, onBack }: MerchantHeaderProps) {
  const { colors } = useTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.coverContainer}>
      <FastImage
        source={{ uri: merchant.coverImage ?? merchant.logo, priority: FastImage.priority.high }}
        style={styles.cover}
        resizeMode={FastImage.resizeMode.cover}
      />
      {/* Dark Overlays */}
      <View style={styles.overlay} />
      <View style={styles.gradient} />

      <View style={[styles.topControls, { paddingTop: insets.top + 6 }]}>
        <AnimatedPressable
          onPress={onBack}
          pressScale={microInteractions.pressScale}
          pressOpacity={microInteractions.pressOpacity}
          pressTranslateY={1}
          style={styles.controlButton}
        >
          <Icon
            name={I18nManager.isRTL ? 'chevron-right' : 'chevron-left'}
            size={22}
            color="#FFFFFF"
          />
        </AnimatedPressable>
      </View>

      {/* Floating Info */}
      <View style={styles.headerContent}>
        <Text style={styles.businessName}>{merchant.businessName}</Text>
        <View style={styles.metaRow}>
          <View style={styles.ratingRow}>
            <Icon name="star" size={16} color={colors.warning} />
            <Text style={styles.ratingText}>{Number(merchant.rating || 0).toFixed(1)}</Text>
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
