import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { Text } from '@dawwar/ui';
import type { ProductVariant } from '@dawwar/types';
import type { ProductDetailStyles } from '../styles';

interface VariantSelectorProps {
  variants: ProductVariant[];
  selectedVariantId?: string;
  labels: {
    variants: string;
  };
  styles: ProductDetailStyles;
  isRTL: boolean;
  onSelectVariant: (variant: ProductVariant) => void;
}

export function VariantSelector({
  variants,
  selectedVariantId,
  labels,
  styles,
  isRTL,
  onSelectVariant,
}: VariantSelectorProps) {
  return (
    <View style={styles.optionSection}>
      <Text style={styles.optionTitle}>{labels.variants}</Text>
      <View style={styles.variantList}>
        {variants.map((variant) => {
          const selected = variant.id === selectedVariantId;
          return (
            <TouchableOpacity
              key={variant.id}
              style={[styles.variantChip, selected && styles.variantChipSelected]}
              onPress={() => onSelectVariant(variant)}
              activeOpacity={0.85}
            >
              <Text style={[styles.variantText, selected && styles.variantTextSelected]}>
                {isRTL ? variant.nameAr || variant.name : variant.name || variant.nameAr}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
