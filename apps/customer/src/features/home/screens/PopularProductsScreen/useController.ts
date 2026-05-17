import { useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from '@dawwar/i18n';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import { selectLocation } from '../../../../store/slices/location.slice';
import { addItem, selectCartMerchantId } from '../../../../store/slices/cart.slice';
import { useFeaturedProducts } from '../../core/hooks';
import { HOME_ROUTES } from '../../../../navigation/routes';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { HomeStackParamList } from '../../../../navigation/types';
import type { Product } from '@dawwar/types';

export function useController() {
  const { t } = useTranslation();
  const navigation = useNavigation<StackNavigationProp<HomeStackParamList>>();
  const location = useAppSelector(selectLocation);
  const dispatch = useAppDispatch();
  const cartMerchantId = useAppSelector(selectCartMerchantId);
  
  const {
    data: products,
    isLoading,
    isError,
    refetch,
  } = useFeaturedProducts(location.latitude ?? undefined, location.longitude ?? undefined);

  const handleProductAdd = useCallback(
    (product: Product) => {
      const doAdd = () => {
        dispatch(
          addItem({
            productId: product.id,
            name: product.name,
            nameAr: product.nameAr,
            price: product.price,
            quantity: 1,
            image: product.images[0] ?? 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=1000',
            merchantId: product.merchantId,
            merchantName: 'Dawwar Merchant', // UI Fallback
            merchantNameAr: 'Dawwar Merchant',
          }),
        );
      };

      if (cartMerchantId && cartMerchantId !== product.merchantId) {
        import('react-native').then(({ Alert }) => {
          Alert.alert(
            t('cart.conflict_title', 'Replace Cart?'),
            t('cart.conflict_body', 'Your cart contains items from another store. Do you want to clear it and add this item?'),
            [
              { text: t('common.cancel', 'Cancel'), style: 'cancel' },
              {
                text: t('cart.clear_and_add', 'Clear & Add'),
                style: 'destructive',
                onPress: doAdd,
              },
            ],
          );
        });
        return;
      }

      doAdd();
    },
    [dispatch, cartMerchantId, t],
  );

  return {
    products: products ?? [],
    isLoading,
    isError,
    handleProductAdd,
    handleBack: () => navigation.goBack(),
    refetch,
    t,
  };
}
