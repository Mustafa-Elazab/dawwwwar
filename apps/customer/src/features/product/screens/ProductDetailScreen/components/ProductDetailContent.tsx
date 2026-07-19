import React from 'react';
import { Image, TouchableOpacity, View } from 'react-native';
import { Text, Icon } from '@dawwar/ui';
import type { ModifierGroup, Product, ProductVariant } from '@dawwar/types';
import { ModifierGroupSection } from './ModifierGroupSection';
import { VariantSelector } from './VariantSelector';
import type { ProductDetailStyles } from '../styles';

interface ProductDetailContentProps {
  product: Product;
  productName: string;
  description?: string;
  image: string;
  merchantName: string;
  quantity: number;
  selectedOptionIds: Record<string, string[]>;
  selectedVariantId?: string;
  validationError?: string;
  unitPrice: string;
  labels: {
    noDescription: string;
    price: string;
    quantity: string;
    store: string;
    options: string;
    required: string;
    optional: string;
    chooseOne: string;
    chooseUpTo: string;
    variants: string;
  };
  isRTL: boolean;
  styles: ProductDetailStyles;
  onMerchantPress: () => void;
  onDecreaseQuantity: () => void;
  onIncreaseQuantity: () => void;
  onToggleOption: (group: ModifierGroup, optionId: string) => void;
  onSelectVariant: (variant: ProductVariant) => void;
}

export function ProductDetailContent({
  product,
  productName,
  description,
  image,
  merchantName,
  quantity,
  selectedOptionIds,
  selectedVariantId,
  validationError,
  unitPrice,
  labels,
  isRTL,
  styles,
  onMerchantPress,
  onDecreaseQuantity,
  onIncreaseQuantity,
  onToggleOption,
  onSelectVariant,
}: ProductDetailContentProps) {
  return (
    <>
      <Image source={{ uri: image }} style={styles.image} resizeMode="cover" />

      <View style={styles.body}>
        <View style={styles.titleBlock}>
          <Text style={styles.name}>{productName}</Text>
          <Text style={styles.description}>
            {description || labels.noDescription}
          </Text>
        </View>

        <TouchableOpacity style={styles.merchantCard} activeOpacity={0.8} onPress={onMerchantPress}>
          <View style={styles.merchantText}>
            <Text style={styles.merchantLabel}>{labels.store}</Text>
            <Text style={styles.merchantName}>{merchantName}</Text>
          </View>
          <View style={styles.merchantIcon}>
            <Icon name="storefront-outline" size={22} color={styles.tokens.primary} />
          </View>
          <Icon name={isRTL ? 'chevron-left' : 'chevron-right'} size={22} color={styles.tokens.textSecondary} />
        </TouchableOpacity>

        {product.variants && product.variants.length > 0 ? (
          <VariantSelector
            variants={product.variants}
            selectedVariantId={selectedVariantId}
            labels={labels}
            styles={styles}
            isRTL={isRTL}
            onSelectVariant={onSelectVariant}
          />
        ) : null}

        {(product.modifierGroups ?? []).map((group) => (
          <ModifierGroupSection
            key={group.id}
            group={group}
            selectedOptionIds={selectedOptionIds[group.id] ?? []}
            labels={labels}
            styles={styles}
            isRTL={isRTL}
            onToggleOption={(optionId) => onToggleOption(group, optionId)}
          />
        ))}

        {validationError ? (
          <View style={styles.validationBox}>
            <Text style={styles.validationText}>{validationError}</Text>
          </View>
        ) : null}

        <View style={styles.buyCard}>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>{labels.price}</Text>
            <Text style={styles.price}>{unitPrice}</Text>
          </View>

          <View style={styles.quantityRow}>
            <Text style={styles.quantityLabel}>{labels.quantity}</Text>
            <View style={styles.stepper}>
              <TouchableOpacity
                style={[styles.stepperBtn, styles.stepperBtnSecondary]}
                onPress={onDecreaseQuantity}
              >
                <Icon name="minus" size={18} color={styles.tokens.text} />
              </TouchableOpacity>
              <Text style={styles.quantityValue}>{quantity}</Text>
              <TouchableOpacity style={styles.stepperBtn} onPress={onIncreaseQuantity}>
                <Icon name="plus" size={18} color={styles.tokens.primaryText} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </>
  );
}
