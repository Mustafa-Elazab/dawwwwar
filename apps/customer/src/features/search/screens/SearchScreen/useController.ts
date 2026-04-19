import { useState, useCallback, useEffect, useRef } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from '@dawwar/i18n';
import { useAppDispatch } from '../../../../store/hooks';
import { addItem } from '../../../../store/slices/cart.slice';
import { searchApi, type SearchResults } from '../../core/api';
import { mockMerchants } from '@dawwar/mocks';
import { HOME_ROUTES } from '../../../navigation/routes';
import type { SearchScreenNavProp } from './types';
import type { Product, Merchant } from '@dawwar/types';

const DEBOUNCE_MS = 350;

export function useController() {
  const { t } = useTranslation();
  const navigation = useNavigation<SearchScreenNavProp>();
  const dispatch = useAppDispatch();

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
        const res = await searchApi.search(query);
        setResults(res);
      } finally {
        setIsLoading(false);
      }
    }, DEBOUNCE_MS);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  const handleMerchantPress = useCallback(
    (merchantId: string) => {
      navigation.navigate(HOME_ROUTES.MERCHANT_DETAIL, { merchantId });
    },
    [navigation],
  );

  const handleProductAdd = useCallback(
    (product: Product) => {
      const merchant = mockMerchants.find((m) => m.id === product.merchantId);
      if (!merchant) return;
      dispatch(
        addItem({
          productId: product.id,
          name: product.name,
          nameAr: product.nameAr,
          price: product.price,
          quantity: 1,
          image: product.images[0] ?? '',
          merchantId: merchant.id,
          merchantName: merchant.businessName,
        }),
      );
    },
    [dispatch],
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
