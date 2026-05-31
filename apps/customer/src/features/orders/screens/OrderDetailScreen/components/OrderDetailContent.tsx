import React from 'react';
import { View } from 'react-native';
import type { AppColors } from '@dawwar/theme';
import { OrderStatus } from '@dawwar/types';
import { createStyles } from '../styles';
import type {
  OrderDetailItemView,
  OrderInfoBlockView,
  OrderMoneyRowView,
} from '../useController';
import { OrderInfoBlock } from './OrderInfoBlock';
import { OrderItemsSection } from './OrderItemsSection';
import { OrderReasonBox } from './OrderReasonBox';
import { OrderSummaryHeader } from './OrderSummaryHeader';
import { OrderTotalsSection } from './OrderTotalsSection';

interface OrderDetailContentProps {
  colors: AppColors;
  isRTL: boolean;
  summaryTitle: string;
  status?: {
    label: string;
    color: string;
    backgroundColor: string;
  };
  items: OrderDetailItemView[];
  infoBlocks: OrderInfoBlockView[];
  moneyRows: OrderMoneyRowView[];
  orderStatus?: OrderStatus;
  cancelledReasonTitle: string;
  cancelReason: string;
}

export function OrderDetailContent({
  colors,
  isRTL,
  summaryTitle,
  status,
  items,
  infoBlocks,
  moneyRows,
  orderStatus,
  cancelledReasonTitle,
  cancelReason,
}: OrderDetailContentProps) {
  const styles = createStyles(colors, isRTL);

  return (
    <View style={styles.content}>
      <OrderSummaryHeader
        colors={colors}
        isRTL={isRTL}
        title={summaryTitle}
        status={status}
      />
      <OrderItemsSection colors={colors} isRTL={isRTL} items={items} />
      {infoBlocks.map((block) => (
        <OrderInfoBlock
          key={block.icon}
          colors={colors}
          isRTL={isRTL}
          block={block}
        />
      ))}
      <OrderTotalsSection colors={colors} isRTL={isRTL} rows={moneyRows} />
      {orderStatus === OrderStatus.CANCELLED ? (
        <OrderReasonBox
          colors={colors}
          isRTL={isRTL}
          title={cancelledReasonTitle}
          reason={cancelReason}
        />
      ) : null}
    </View>
  );
}
