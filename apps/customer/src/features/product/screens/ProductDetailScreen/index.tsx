import React from 'react';
import { View } from 'react-native';
import { Button, ScrollScreenTemplate } from '@dawwar/ui';
import { ProductDetailContent } from './components/ProductDetailContent';
import { useController } from './useController';

export function ProductDetailScreen() {
  const ctrl = useController();

  return (
    <ScrollScreenTemplate
      headerProps={{
        title: ctrl.labels.title,
        onBackPress: ctrl.handlers.handleBack,
      }}
      state={ctrl.screenState}
      onRetry={ctrl.handlers.handleRetry}
      contentStyle={ctrl.styles.content}
      footer={
        ctrl.product ? (
          <View style={ctrl.styles.footer}>
            <Button
              label={`${ctrl.labels.addToBasket} · ${ctrl.formattedTotal}`}
              onPress={ctrl.handlers.handleAddToCart}
              disabled={!ctrl.product.isAvailable}
              fullWidth
            />
          </View>
        ) : undefined
      }
    >
      {ctrl.product ? (
        <ProductDetailContent
          product={ctrl.product}
          productName={ctrl.productName}
          description={ctrl.description}
          image={ctrl.image}
          merchantName={ctrl.merchantName}
          quantity={ctrl.quantity}
          selectedOptionIds={ctrl.selectedOptionIds}
          selectedVariantId={ctrl.selectedVariantId}
          validationError={ctrl.validationError}
          unitPrice={ctrl.formattedUnitPrice}
          labels={ctrl.labels}
          isRTL={ctrl.isRTL}
          styles={ctrl.styles}
          onMerchantPress={ctrl.handlers.handleMerchantPress}
          onDecreaseQuantity={ctrl.handlers.handleDecreaseQuantity}
          onIncreaseQuantity={ctrl.handlers.handleIncreaseQuantity}
          onToggleOption={ctrl.handlers.handleToggleOption}
          onSelectVariant={ctrl.handlers.handleSelectVariant}
        />
      ) : null}
    </ScrollScreenTemplate>
  );
}
