import React from 'react';
import { Pressable, View } from 'react-native';
import { Icon, Text } from '@dawwar/ui';
import type { AppColors } from '@dawwar/theme';
import type { PromotionItem } from '../useController';
import type { createStyles } from '../styles';
import { PromoCodeInput } from './PromoCodeInput';
import { PromotionRow } from './PromotionRow';

interface PromotionsContentProps {
  colors: AppColors;
  styles: ReturnType<typeof createStyles>;
  promoCode: string;
  shippingOffers: PromotionItem[];
  orderOffers: PromotionItem[];
  labels: {
    promoCodePlaceholder: string;
    apply: string;
    shippingOffers: string;
    orderOffers: string;
    getMore: string;
    noShippingOffers: string;
    noOrderOffers: string;
  };
  onPromoCodeChange: (value: string) => void;
  onPromoCodeApply: () => void;
  onOpenInfo: (promotion: PromotionItem) => void;
  onGetMore: () => void;
}

export function PromotionsContent({
  colors,
  styles,
  promoCode,
  shippingOffers,
  orderOffers,
  labels,
  onPromoCodeChange,
  onPromoCodeApply,
  onOpenInfo,
  onGetMore,
}: PromotionsContentProps) {
  return (
    <>
      <PromoCodeInput
        value={promoCode}
        placeholder={labels.promoCodePlaceholder}
        applyLabel={labels.apply}
        colors={colors}
        styles={styles}
        onChangeText={onPromoCodeChange}
        onApply={onPromoCodeApply}
      />

      <View style={styles.rowsGroup}>
        <Text style={styles.sectionTitle}>{labels.shippingOffers}</Text>
        {shippingOffers.length > 0 ? (
          shippingOffers.map((promotion) => (
            <PromotionRow
              key={promotion.id}
              promotion={promotion}
              selected
              disabled={false}
              colors={colors}
              styles={styles}
              onInfo={onOpenInfo}
            />
          ))
        ) : (
          <Text style={styles.emptyText}>{labels.noShippingOffers}</Text>
        )}
      </View>

      <View style={styles.rowsGroup}>
        <Text style={styles.sectionTitle}>{labels.orderOffers}</Text>
        {orderOffers.length > 0 ? (
          orderOffers.map((promotion) => (
            <PromotionRow
              key={promotion.id}
              promotion={promotion}
              selected
              disabled={false}
              colors={colors}
              styles={styles}
              onInfo={onOpenInfo}
            />
          ))
        ) : (
          <Text style={styles.emptyText}>{labels.noOrderOffers}</Text>
        )}
      </View>

      <Pressable style={styles.getMoreButton} onPress={onGetMore} accessibilityRole="button">
        <Icon name="plus" size={24} color={colors.primary} />
        <Text style={styles.getMoreText}>{labels.getMore}</Text>
      </Pressable>
    </>
  );
}
