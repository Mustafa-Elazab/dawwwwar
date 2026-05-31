import React, { useMemo, useState } from 'react';
import { Alert, ScrollView, TouchableOpacity, View, I18nManager } from 'react-native';
import FastImage from 'react-native-fast-image';
import { useQuery } from '@tanstack/react-query';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTranslation } from '@dawwar/i18n';
import { useTheme } from '@dawwar/theme';
import { Button, ErrorState, Icon, LoadingSpinner, ScreenTemplate, Text } from '@dawwar/ui';
import type { Merchant, Product } from '@dawwar/types';
import api from '../../../../core/api/client';
import { addItem, clearCart, selectCartMerchantId } from '../../../../store/slices/cart.slice';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import { HOME_ROUTES, TAB_ROUTES } from '../../../../navigation/routes';
import { createStyles } from './styles';

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=1000';

const unwrap = <T,>(res: T | { data: T }): T =>
  res && typeof res === 'object' && 'data' in res ? res.data : (res as T);

export function ProductDetailScreen() {
  const { t, i18n } = useTranslation();
  const { colors } = useTheme();
  const isRTL = i18n.language.startsWith('ar') || I18nManager.isRTL;
  const styles = useMemo(() => createStyles(colors, isRTL), [colors, isRTL]);
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const productId = route.params?.productId as string;
  const dispatch = useAppDispatch();
  const cartMerchantId = useAppSelector(selectCartMerchantId);
  const [quantity, setQuantity] = useState(1);

  const {
    data: product,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['product', productId],
    queryFn: async () => {
      const { data } = await api.get(`/products/${productId}`);
      return unwrap<Product>(data);
    },
    enabled: !!productId,
  });

  const { data: merchant } = useQuery({
    queryKey: ['merchant', product?.merchantId],
    queryFn: async () => {
      const { data } = await api.get(`/merchants/${product!.merchantId}`);
      return unwrap<Merchant>(data);
    },
    enabled: !!product?.merchantId,
  });

  if (isLoading) return <LoadingSpinner fullscreen />;
  if (isError || !product) return <ErrorState onRetry={refetch} />;

  const productName = isRTL ? product.nameAr || product.name : product.name || product.nameAr;
  const description = isRTL
    ? product.descriptionAr || product.description
    : product.description || product.descriptionAr;
  const merchantName = merchant?.businessName ?? t('liked.store');
  const image = product.images?.[0] || FALLBACK_IMAGE;

  const addToCart = () => {
    const doAdd = () => {
      for (let index = 0; index < quantity; index += 1) {
        dispatch(
          addItem({
            productId: product.id,
            name: product.name,
            nameAr: product.nameAr,
            price: product.price,
            quantity: 1,
            image,
            merchantId: product.merchantId,
            merchantName,
            merchantNameAr: merchantName,
          }),
        );
      }
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
  };

  return (
    <ScreenTemplate
      headerProps={{
        title: t('product.details_title'),
        onBackPress: () => navigation.goBack(),
      }}
      footer={
        <View style={styles.footer}>
          <Button
            label={`${t('product.add_to_basket')} · ${(Number(product.price) * quantity).toFixed(2)} ${t('common.egp')}`}
            onPress={addToCart}
            disabled={!product.isAvailable}
            fullWidth
          />
        </View>
      }
    >
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <FastImage source={{ uri: image }} style={styles.image} resizeMode={FastImage.resizeMode.cover} />

        <View style={styles.body}>
          <View style={styles.titleBlock}>
            <Text style={styles.name}>{productName}</Text>
            <Text style={styles.description}>
              {description || t('product.no_description')}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.merchantCard}
            activeOpacity={0.8}
            onPress={() =>
              navigation.getParent()?.navigate(TAB_ROUTES.HOME_TAB, {
                screen: HOME_ROUTES.MERCHANT_DETAIL,
                params: { merchantId: product.merchantId },
              })
            }
          >
            <View style={styles.merchantIcon}>
              <Icon name="storefront-outline" size={22} color={colors.primary} />
            </View>
            <View style={styles.merchantText}>
              <Text style={styles.merchantLabel}>{t('liked.store')}</Text>
              <Text style={styles.merchantName}>{merchantName}</Text>
            </View>
            <Icon name={isRTL ? 'chevron-left' : 'chevron-right'} size={22} color={colors.textSecondary} />
          </TouchableOpacity>

          <View style={styles.buyCard}>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>{t('product.price')}</Text>
              <Text style={styles.price}>
                {product.price} {t('common.egp')}
              </Text>
            </View>

            <View style={styles.quantityRow}>
              <Text style={styles.quantityLabel}>{t('product.quantity')}</Text>
              <View style={styles.stepper}>
                <TouchableOpacity
                  style={[styles.stepperBtn, styles.stepperBtnSecondary]}
                  onPress={() => setQuantity((current) => Math.max(1, current - 1))}
                >
                  <Icon name="minus" size={18} color={colors.text} />
                </TouchableOpacity>
                <Text style={styles.quantityValue}>{quantity}</Text>
                <TouchableOpacity
                  style={styles.stepperBtn}
                  onPress={() => setQuantity((current) => current + 1)}
                >
                  <Icon name="plus" size={18} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {!product.isAvailable ? (
            <View style={styles.unavailable}>
              <Text style={styles.unavailableText}>{t('merchant.unavailable')}</Text>
            </View>
          ) : null}
        </View>
      </ScrollView>
    </ScreenTemplate>
  );
}
