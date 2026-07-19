import { useCallback, useMemo, useState } from 'react';
import { Alert, I18nManager } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTranslation } from '@dawwar/i18n';
import { useTheme } from '@dawwar/theme';
import { useProductDetails } from '@dawwar/api-client';
import {
  ProductModifierGroupType,
  type ApiResponse,
  type ModifierGroup,
  type Product,
  type ProductVariant,
  type SelectedModifierGroup,
} from '@dawwar/types';
import { addItem, clearCart, selectCartMerchantId } from '../../../../store/slices/cart.slice';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import { HOME_ROUTES, TAB_ROUTES } from '../../../../navigation/routes';
import { useMerchantDetail } from '../../../merchant/core/hooks';
import { createStyles } from './styles';

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=1000';

const unwrap = <T,>(res: ApiResponse<T> | T | undefined): T | undefined =>
  res && typeof res === 'object' && 'data' in res ? res.data : (res as T | undefined);

function getLocalizedName(
  primary: string | undefined,
  secondary: string | undefined,
  isRTL: boolean,
) {
  return isRTL ? secondary || primary || '' : primary || secondary || '';
}

export function useController() {
  const { t, i18n } = useTranslation();
  const { colors } = useTheme();
  const isRTL = i18n.language.startsWith('ar') || I18nManager.isRTL;
  const styles = useMemo(() => createStyles(colors, isRTL), [colors, isRTL]);
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const productId = route.params?.productId as string | undefined;
  const dispatch = useAppDispatch();
  const cartMerchantId = useAppSelector(selectCartMerchantId);

  const productQuery = useProductDetails(productId);
  const product = unwrap<Product>(productQuery.data);
  const merchantQuery = useMerchantDetail(product?.merchantId ?? '');
  const merchant = merchantQuery.data;

  const [quantity, setQuantity] = useState(1);
  const [selectedOptionIds, setSelectedOptionIds] = useState<Record<string, string[]>>({});
  const [selectedVariantId, setSelectedVariantId] = useState<string | undefined>();
  const [validationError, setValidationError] = useState<string | undefined>();

  const selectedVariant = useMemo(
    () => product?.variants?.find((variant) => variant.id === selectedVariantId),
    [product?.variants, selectedVariantId],
  );

  const selectedModifiers = useMemo<SelectedModifierGroup[]>(() => {
    if (!product?.modifierGroups) return [];

    return product.modifierGroups
      .map((group) => {
        const selectedIds = selectedOptionIds[group.id] ?? [];
        const options = group.options
          .filter((option) => selectedIds.includes(option.id))
          .map((option) => ({
            optionId: option.id,
            name: option.name,
            nameAr: option.nameAr,
            priceDelta: Number(option.priceDelta || 0),
          }));

        return {
          groupId: group.id,
          groupName: group.name,
          groupNameAr: group.nameAr,
          options,
        };
      })
      .filter((group) => group.options.length > 0);
  }, [product?.modifierGroups, selectedOptionIds]);

  const unitPrice = useMemo(() => {
    if (!product) return 0;
    const variantPrice =
      selectedVariant?.price != null
        ? Number(selectedVariant.price)
        : Number(product.price) + Number(selectedVariant?.priceDelta ?? 0);
    const modifiersTotal = selectedModifiers.reduce(
      (sum, group) => sum + group.options.reduce((optionSum, option) => optionSum + option.priceDelta, 0),
      0,
    );
    return variantPrice + modifiersTotal;
  }, [product, selectedModifiers, selectedVariant]);

  const validateSelections = useCallback(() => {
    if (!product) return undefined;

    for (const group of product.modifierGroups ?? []) {
      const count = selectedOptionIds[group.id]?.length ?? 0;
      const min = group.required ? Math.max(group.min ?? 1, 1) : group.min ?? 0;
      const max = group.type === ProductModifierGroupType.SINGLE ? 1 : group.max;
      const groupName = getLocalizedName(group.name, group.nameAr, isRTL);

      if (count < min) {
        return t('product.modifier_required', { name: groupName });
      }
      if (max != null && count > max) {
        return t('product.modifier_max', { name: groupName, count: max });
      }
    }

    return undefined;
  }, [isRTL, product, selectedOptionIds, t]);

  const handleToggleOption = useCallback(
    (group: ModifierGroup, optionId: string) => {
      setValidationError(undefined);
      setSelectedOptionIds((current) => {
        const previous = current[group.id] ?? [];
        if (group.type === ProductModifierGroupType.SINGLE) {
          const isSelected = previous.includes(optionId);
          const next = isSelected && !group.required ? [] : [optionId];
          return { ...current, [group.id]: next };
        }

        const isSelected = previous.includes(optionId);
        if (isSelected) {
          return { ...current, [group.id]: previous.filter((id) => id !== optionId) };
        }

        if (group.max != null && previous.length >= group.max) {
          return current;
        }

        return { ...current, [group.id]: [...previous, optionId] };
      });
    },
    [],
  );

  const buildLineKey = useCallback(() => {
    const optionKey = selectedModifiers
      .flatMap((group) => group.options.map((option) => `${group.groupId}:${option.optionId}`))
      .sort()
      .join('|');
    return [product?.id, selectedVariant?.id, optionKey].filter(Boolean).join('::');
  }, [product?.id, selectedModifiers, selectedVariant?.id]);

  const handleAddToCart = useCallback(() => {
    if (!product) return;

    const error = validateSelections();
    if (error) {
      setValidationError(error);
      return;
    }

    const merchantName = merchant?.businessName ?? t('liked.store');
    const image = product.images?.[0] || FALLBACK_IMAGE;
    const doAdd = () => {
      dispatch(
        addItem({
          lineKey: buildLineKey(),
          productId: product.id,
          name: product.name,
          nameAr: product.nameAr,
          price: unitPrice,
          quantity,
          image,
          merchantId: product.merchantId,
          merchantName,
          merchantNameAr: merchantName,
          selectedModifiers,
          variant: selectedVariant,
        }),
      );
      navigation.goBack();
    };

    if (cartMerchantId && cartMerchantId !== product.merchantId) {
      Alert.alert(
        t('cart.conflict_title', 'Replace Cart?'),
        t('cart.conflict_body', 'Your cart contains items from another store. Do you want to clear it and add this item?'),
        [
          { text: t('common.cancel', 'Cancel'), style: 'cancel' },
          {
            text: t('cart.clear_and_add', 'Clear & Add'),
            style: 'destructive',
            onPress: () => {
              dispatch(clearCart());
              doAdd();
            },
          },
        ],
      );
      return;
    }

    doAdd();
  }, [
    buildLineKey,
    cartMerchantId,
    dispatch,
    merchant?.businessName,
    navigation,
    product,
    quantity,
    selectedModifiers,
    selectedVariant,
    t,
    unitPrice,
    validateSelections,
  ]);

  const handleMerchantPress = useCallback(() => {
    if (!product) return;
    navigation.getParent()?.navigate(TAB_ROUTES.HOME_TAB, {
      screen: HOME_ROUTES.MERCHANT_DETAIL,
      params: { merchantId: product.merchantId },
    });
  }, [navigation, product]);

  const productName = product ? getLocalizedName(product.name, product.nameAr, isRTL) : '';
  const description = product
    ? getLocalizedName(product.description, product.descriptionAr, isRTL)
    : undefined;

  return {
    colors,
    isRTL,
    styles,
    product,
    productName,
    description,
    image: product?.images?.[0] || FALLBACK_IMAGE,
    merchantName: merchant?.businessName ?? t('liked.store'),
    quantity,
    selectedOptionIds,
    selectedVariantId,
    validationError,
    formattedUnitPrice: `${unitPrice.toFixed(2)} ${t('common.egp')}`,
    formattedTotal: `${(unitPrice * quantity).toFixed(2)} ${t('common.egp')}`,
    screenState: {
      isLoading: productQuery.isLoading,
      isError: productQuery.isError,
      isEmpty: !product && !productQuery.isLoading && !productQuery.isError,
      emptyState: {
        icon: 'package-variant',
        title: t('product.not_found'),
        subtitle: t('product.not_found_sub'),
      },
    },
    labels: {
      title: t('product.details_title'),
      noDescription: t('product.no_description'),
      price: t('product.price'),
      quantity: t('product.quantity'),
      addToBasket: t('product.add_to_basket'),
      store: t('liked.store'),
      options: t('product.options'),
      required: t('product.required'),
      optional: t('product.optional'),
      chooseOne: t('product.choose_one'),
      chooseUpTo: t('product.choose_up_to'),
      variants: t('product.variants'),
    },
    handlers: {
      handleBack: () => navigation.goBack(),
      handleRetry: productQuery.refetch,
      handleMerchantPress,
      handleDecreaseQuantity: () => setQuantity((current) => Math.max(1, current - 1)),
      handleIncreaseQuantity: () => setQuantity((current) => current + 1),
      handleToggleOption,
      handleSelectVariant: (variant: ProductVariant) => setSelectedVariantId(variant.id),
      handleAddToCart,
    },
  };
}
