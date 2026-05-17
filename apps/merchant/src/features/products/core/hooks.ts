import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productsCatalogApi } from './api';
import Toast from 'react-native-toast-message';
import { useTranslation } from '@dawwar/i18n';
import type { Product } from '@dawwar/types';

export const PRODUCT_KEYS = {
  list: () => ['products'] as const,
};

export function useMerchantProducts() {
  return useQuery({
    queryKey: PRODUCT_KEYS.list(),
    queryFn: () => productsCatalogApi.getProducts(''),
    staleTime: 60_000,
    select: (res) => res.data,
  });
}

export function useToggleAvailability() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ productId, isAvailable }: { productId: string; isAvailable: boolean }) =>
      productsCatalogApi.toggleAvailability(productId, isAvailable),
    // Optimistic update
    onMutate: async ({ productId, isAvailable }) => {
      await queryClient.cancelQueries({ queryKey: PRODUCT_KEYS.list() });
      const prev = queryClient.getQueriesData({ queryKey: PRODUCT_KEYS.list() });
      queryClient.setQueriesData({ queryKey: PRODUCT_KEYS.list() }, (old: { data: Product[] } | undefined) => {
        if (!old?.data) return old;
        return { ...old, data: old.data.map((p: Product) => p.id === productId ? { ...p, isAvailable } : p) };
      });
      return { prev };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) queryClient.setQueriesData({ queryKey: PRODUCT_KEYS.list() }, ctx.prev);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: PRODUCT_KEYS.list() }),
  });
}

export function useSaveProduct() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (product: Partial<Product>) =>
      productsCatalogApi.saveProduct(product as Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'totalOrders'>),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: PRODUCT_KEYS.list() });
      Toast.show({ type: 'success', text1: t('merchant_app.product_saved') });
    },
    onError: () => Toast.show({ type: 'error', text1: t('errors.server') }),
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: productsCatalogApi.deleteProduct,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: PRODUCT_KEYS.list() });
    },
  });
}
