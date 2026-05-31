import { useState, useCallback, useEffect, useRef } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from '@dawwar/i18n';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import { selectLocation } from '../../../../store/slices/location.slice';
import { addItem, clearCart } from '../../../../store/slices/cart.slice';
import { searchApi, type SearchResults } from '../../core/api';
import { HOME_ROUTES } from '../../../../navigation/routes';
import type { SearchScreenNavProp } from './types';
import type { Product, Merchant } from '@dawwar/types';

const DEBOUNCE_MS = 350;

export function useController() {
  const { t } = useTranslation();
  const navigation = useNavigation<SearchScreenNavProp>();
  const dispatch = useAppDispatch();
  const location = useAppSelector(selectLocation);

  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResults | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Debounced search — fires 350ms after user stops typing
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!query.trim()) {
      setResults(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await searchApi.search(query, location.latitude ?? undefined, location.longitude ?? undefined);
        setResults(res);
      } finally {
        setIsLoading(false);
      }
    }, DEBOUNCE_MS);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, location.latitude, location.longitude]);

  const handleMerchantPress = useCallback(
    (merchantId: string) => {
      navigation.navigate(HOME_ROUTES.MERCHANT_DETAIL, { merchantId });
    },
    [navigation],
  );

  const cartMerchantId = useAppSelector((state: any) => state.cart.merchantId);

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
                onPress: () => {
                  dispatch(clearCart());
                  doAdd();
                },
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

  const handleCategoryPress = useCallback(
    (categoryId: string, categoryName: string) => {
      navigation.navigate(HOME_ROUTES.CATEGORY_MERCHANTS, { categoryId, categoryName });
    },
    [navigation],
  );

  const hasResults =
    results !== null &&
    (results.merchants.length > 0 ||
      results.products.length > 0 ||
      results.categories.length > 0);

  const isEmpty = results !== null && !hasResults;

  return {
    query,
    setQuery,
    results,
    isLoading,
    hasResults,
    isEmpty,
    handleMerchantPress,
    handleProductAdd,
    handleCategoryPress,
    handleBack: () => navigation.goBack(),
    t,
  };
}
