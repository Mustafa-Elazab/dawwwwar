import React from 'react';
import { ScrollScreenTemplate } from '@dawwar/ui';
import { GetMorePromotionsContent } from './components/GetMorePromotionsContent';
import { GetMorePromotionsHeader } from './components/GetMorePromotionsHeader';
import { useController } from './useController';

export function GetMorePromotionsScreen() {
  const ctrl = useController();

  return (
    <ScrollScreenTemplate
      header={
        <GetMorePromotionsHeader
          title={ctrl.labels.title}
          isRTL={ctrl.isRTL}
          colors={ctrl.colors}
          styles={ctrl.styles}
          onBack={ctrl.handlers.handleBack}
        />
      }
      contentStyle={ctrl.styles.content}
    >
      <GetMorePromotionsContent
        actions={ctrl.actions}
        isRTL={ctrl.isRTL}
        colors={ctrl.colors}
        styles={ctrl.styles}
        onActionPress={ctrl.handlers.handleActionPress}
      />
    </ScrollScreenTemplate>
  );
}
