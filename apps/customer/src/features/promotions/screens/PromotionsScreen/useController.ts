import { useCallback, useMemo, useState } from 'react';
import { I18nManager } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { useValidatePromo, type ValidatePromoResult } from '@dawwar/api-client';
import { useTranslation } from '@dawwar/i18n';
import { useTheme } from '@dawwar/theme';
import { PROFILE_ROUTES } from '../../../../navigation/routes';
import type { ProfileStackParamList } from '../../../../navigation/types';
import { useAppSelector } from '../../../../store/hooks';
import { selectCartTotal } from '../../../../store/slices/cart.slice';
import type { StackNavigationProp } from '@react-navigation/stack';
import { createStyles } from './styles';

export type PromotionSection = 'shipping' | 'order';

export interface PromotionItem {
  id: string;
  section: PromotionSection;
  title: string;
  code: string;
  description: string;
  duration: string;
  scope: string;
  discountAmount: string;
  terms: string;
}

const unwrap = <T,>(res: T | { data?: T }): T =>
  res && typeof res === 'object' && 'data' in res && res.data ? res.data : (res as T);

function inferPromotionSection(code: string): PromotionSection {
  const normalized = code.toUpperCase();
  return normalized.includes('SHIP') || normalized.includes('DELIVERY') || normalized.includes('FREE')
    ? 'shipping'
    : 'order';
}

export function useController() {
  const { t, i18n } = useTranslation();
  const { colors } = useTheme();
  const isRTL = i18n.language.startsWith('ar') || I18nManager.isRTL;
  const styles = useMemo(() => createStyles(colors, isRTL), [colors, isRTL]);
  const navigation = useNavigation<StackNavigationProp<ProfileStackParamList>>();
  const cartTotal = useAppSelector(selectCartTotal);
  const validatePromoMutation = useValidatePromo();

  const [promoCode, setPromoCode] = useState('');
  const [appliedPromotions, setAppliedPromotions] = useState<PromotionItem[]>([]);
  const [infoPromotion, setInfoPromotion] = useState<PromotionItem | null>(null);

  const shippingOffers = appliedPromotions.filter((promotion) => promotion.section === 'shipping');
  const orderOffers = appliedPromotions.filter((promotion) => promotion.section === 'order');

  const resolveErrorMessage = useCallback((error?: string) => {
    if (!error) return t('promotions.invalid_code');
    if (error.startsWith('MIN_ORDER_')) {
      return t('promotions.min_order_error', { amount: error.replace('MIN_ORDER_', '') });
    }
    if (error === 'PROMO_EXPIRED') return t('promotions.expired');
    if (error === 'PROMO_EXHAUSTED') return t('promotions.exhausted');
    return t('promotions.invalid_code');
  }, [t]);

  const buildPromotionItem = useCallback((result: ValidatePromoResult, normalizedCode: string): PromotionItem | null => {
    const promo = result.promoCode;
    if (!promo) return null;

    const discountValue = Number(promo.discountValue ?? 0);
    const discountAmount = Number(result.discountAmount ?? 0);
    const section = inferPromotionSection(promo.code || normalizedCode);
    const title = promo.discountType === 'PERCENT'
      ? t('promotions.percent_off', { percent: discountValue })
      : t('promotions.fixed_off', { amount: discountValue.toFixed(2) });

    return {
      id: promo.id || normalizedCode,
      section,
      title,
      code: promo.code || normalizedCode,
      description: t('promotions.backend_success_desc'),
      duration: promo.expiresAt
        ? t('promotions.expires_on', { date: new Date(promo.expiresAt).toLocaleDateString() })
        : t('promotions.no_expiry'),
      scope: section === 'shipping' ? t('promotions.scope_shipping') : t('promotions.scope_order'),
      discountAmount: t('promotions.discount_amount_value', { amount: discountAmount.toFixed(2) }),
      terms: promo.minOrderAmount && Number(promo.minOrderAmount) > 0
        ? t('promotions.min_order_terms', { amount: Number(promo.minOrderAmount).toFixed(2) })
        : t('promotions.minimum_order_terms'),
    };
  }, [t]);

  const handleApply = useCallback(async () => {
    const normalizedCode = promoCode.trim().toUpperCase();
    if (!normalizedCode) {
      Toast.show({ type: 'error', text1: t('promotions.enter_code') });
      return;
    }

    try {
      const response = await validatePromoMutation.mutateAsync({
        code: normalizedCode,
        orderAmount: Math.max(Number(cartTotal) || 0, 0),
      });
      const result = unwrap<ValidatePromoResult>(response);

      if (!result.valid) {
        Toast.show({ type: 'error', text1: resolveErrorMessage(result.error) });
        return;
      }

      const promotion = buildPromotionItem(result, normalizedCode);
      if (!promotion) {
        Toast.show({ type: 'error', text1: t('promotions.invalid_code') });
        return;
      }

      setAppliedPromotions((current) => [
        promotion,
        ...current.filter((item) => item.code.toUpperCase() !== promotion.code.toUpperCase()),
      ]);
      setInfoPromotion(promotion);
      setPromoCode('');
      Toast.show({ type: 'success', text1: t('promotions.applied') });
    } catch {
      Toast.show({ type: 'error', text1: t('promotions.invalid_code') });
    }
  }, [
    buildPromotionItem,
    cartTotal,
    promoCode,
    resolveErrorMessage,
    t,
    validatePromoMutation,
  ]);

  return {
    colors,
    isRTL,
    styles,
    promoCode,
    shippingOffers,
    orderOffers,
    infoPromotion,
    isApplying: validatePromoMutation.isPending,
    labels: {
      title: t('promotions.title'),
      promoCodePlaceholder: t('promotions.promo_code'),
      apply: t('common.apply'),
      shippingOffers: t('promotions.shipping_offers'),
      orderOffers: t('promotions.order_offers'),
      getMore: t('promotions.get_more'),
      information: t('promotions.information'),
      description: t('promotions.description'),
      duration: t('promotions.duration'),
      promoCode: t('promotions.promo_code_label'),
      applicableScope: t('promotions.applicable_scope'),
      discountAmount: t('promotions.discount_amount'),
      terms: t('promotions.terms'),
      noShippingOffers: t('promotions.no_shipping_offers'),
      noOrderOffers: t('promotions.no_order_offers'),
      close: t('common.close'),
    },
    handlers: {
      handleBack: () => navigation.goBack(),
      handlePromoCodeChange: setPromoCode,
      handlePromoCodeApply: handleApply,
      handleApply,
      handleGetMore: () => navigation.navigate(PROFILE_ROUTES.GET_MORE_PROMOTIONS),
      handleOpenInfo: setInfoPromotion,
      handleCloseInfo: () => setInfoPromotion(null),
    },
  };
}
