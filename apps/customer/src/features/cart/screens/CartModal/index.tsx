import React from 'react';
import { useTranslation } from '@dawwar/i18n';
import { ScreenTemplate } from '@dawwar/ui';
import { useTheme } from '@dawwar/theme';
import { CartContent } from './components/CartContent';
import { CartFooter } from './components/CartFooter';
import { useController } from './useController';

export function CartModal() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const ctrl = useController();

  return (
    <ScreenTemplate 
      backgroundColor={colors.card}
      headerProps={{
        title: t('cart.title'),
        type: 'none',
      }}
      footer={
        !ctrl.isEmpty && (
          <CartFooter
            colors={colors}
            label={`${t('cart.checkout')} · ${ctrl.total} ${t('common.egp')}`}
            onCheckout={ctrl.handleCheckout}
          />
        )
      }
    >
      <CartContent
        colors={colors}
        items={ctrl.items}
        isEmpty={ctrl.isEmpty}
        subtotal={ctrl.subtotal}
        deliveryFee={ctrl.deliveryFee}
        total={ctrl.total}
        isFeeLoading={ctrl.isFeeLoading}
        labels={{
          empty: t('cart.empty'),
          emptySubtitle: t('cart.empty_sub'),
          continueShopping: t('cart.continue_shopping'),
          promoPlaceholder: t('cart.promo_placeholder', 'هل لديك كود خصم؟'),
          apply: t('cart.apply', 'تطبيق'),
          subtotal: t('cart.subtotal'),
          deliveryFee: t('cart.delivery_fee'),
          total: t('cart.total'),
          egp: t('common.egp'),
          loading: t('common.loading', 'Loading...'),
        }}
        onClose={ctrl.handleClose}
        onAdd={ctrl.handleAdd}
        onRemove={ctrl.handleRemove}
      />
    </ScreenTemplate>
  );
}
