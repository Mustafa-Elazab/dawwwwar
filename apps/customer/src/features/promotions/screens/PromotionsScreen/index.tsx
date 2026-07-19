import React from 'react';
import { View } from 'react-native';
import { Button, ScrollScreenTemplate } from '@dawwar/ui';
import { PromotionsContent } from './components/PromotionsContent';
import { PromotionsHeader } from './components/PromotionsHeader';
import { PromotionInfoSheet } from './components/PromotionInfoSheet';
import { useController } from './useController';

export function PromotionsScreen() {
  const ctrl = useController();

  return (
    <>
      <ScrollScreenTemplate
        header={
          <PromotionsHeader
            title={ctrl.labels.title}
            isRTL={ctrl.isRTL}
            colors={ctrl.colors}
            styles={ctrl.styles}
            onBack={ctrl.handlers.handleBack}
          />
        }
        contentStyle={ctrl.styles.content}
        footer={
          <View style={ctrl.styles.footer}>
            <Button
              label={ctrl.labels.apply}
              onPress={ctrl.handlers.handleApply}
              loading={ctrl.isApplying}
              disabled={ctrl.isApplying || !ctrl.promoCode.trim()}
              fullWidth
            />
          </View>
        }
        keyboardShouldPersistTaps="handled"
      >
        <PromotionsContent
          colors={ctrl.colors}
          styles={ctrl.styles}
          promoCode={ctrl.promoCode}
          shippingOffers={ctrl.shippingOffers}
          orderOffers={ctrl.orderOffers}
          labels={ctrl.labels}
          onPromoCodeChange={ctrl.handlers.handlePromoCodeChange}
          onPromoCodeApply={ctrl.handlers.handlePromoCodeApply}
          onOpenInfo={ctrl.handlers.handleOpenInfo}
          onGetMore={ctrl.handlers.handleGetMore}
        />
      </ScrollScreenTemplate>
      <PromotionInfoSheet
        promotion={ctrl.infoPromotion}
        visible={!!ctrl.infoPromotion}
        colors={ctrl.colors}
        styles={ctrl.styles}
        labels={ctrl.labels}
        onClose={ctrl.handlers.handleCloseInfo}
      />
    </>
  );
}
