import React from 'react';
import { ScrollScreenTemplate } from '@dawwar/ui';
import { OrderDetailContent } from './components/OrderDetailContent';
import { OrderDetailFooter } from './components/OrderDetailFooter';
import { useController } from './useController';

export function OrderDetailScreen() {
  const controller = useController();
  const shouldShowContent = !controller.isLoading && !controller.isError && controller.order;

  return (
    <ScrollScreenTemplate
      headerProps={{
        title: controller.order?.orderNumber,
        onBackPress: controller.handlers.handleBack,
        type: 'default',
      }}
      isLoading={controller.isLoading}
      isError={controller.isError || (!controller.isLoading && !controller.order)}
      onRetry={controller.refetch}
      footer={
        shouldShowContent ? (
          <OrderDetailFooter
            colors={controller.colors}
            isRTL={controller.isRTL}
            canCancel={controller.canCancel}
            isActive={controller.isActive}
            cancelLabel={controller.labels.cancelOrder}
            trackLabel={controller.labels.track}
            reorderLabel={controller.labels.reorder}
            onCancel={controller.handlers.handleCancel}
            onTrack={controller.handlers.handleTrack}
            onReorder={controller.handlers.handleReorder}
          />
        ) : undefined
      }
    >
      {shouldShowContent ? (
        <OrderDetailContent
          colors={controller.colors}
          isRTL={controller.isRTL}
          summaryTitle={controller.labels.orderSummary}
          status={controller.status}
          items={controller.items}
          infoBlocks={controller.infoBlocks}
          moneyRows={controller.moneyRows}
          orderStatus={controller.order?.status}
          cancelledReasonTitle={controller.labels.cancelledReason}
          cancelReason={controller.cancelReason}
        />
      ) : null}
    </ScrollScreenTemplate>
  );
}
