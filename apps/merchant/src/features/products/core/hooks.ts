import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productsCatalogApi } from './api';
import { useAppSelector } from '../../../../store/hooks';
import { selectUser } from '../../../../store/slices/auth.slice';
import { mockMerchants } from '@dawwar/mocks';
import Toast from 'react-native-toast-message';
import { useTranslation } from '@dawwar/i18n';
import type { Product } from '@dawwar/types';

export const PRODUCT_KEYS = {
  list: (merchantId: string) => ['products', merchantId] as const,
};

export function useMerchantProducts() {
  const user = useAppSelector(selectUser);
  const merchant = mockMerchants.find((m) => m.userId === user?.id);

  return useQuery({
    queryKey: PRODUCT_KEYS.list(merchant?.id ?? ''),
    queryFn: () => productsCatalogApi.getProducts(merchant?.id ?? ''),
    enabled: !!merchant?.id,
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
      await queryClient.cancelQueries({ queryKey: ['products'] });
      const prev = queryClient.getQueriesData({ queryKey: ['products'] });
      queryClient.setQueriesData({ queryKey: ['products'] }, (old: { data: Product[] } | undefined) => {
        if (!old?.data) return old;
        return { ...old, data: old.data.map((p: Product) => p.id === productId ? { ...p, isAvailable } : p) };
      });
      return { prev };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) queryClient.setQueriesData({ queryKey: ['products'] }, ctx.prev);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['products'] }),
  });
}

export function useSaveProduct() {
  const user = useAppSelector(selectUser);
  const merchant = mockMerchants.find((m) => m.userId === user?.id);
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (product: Partial<Product>) =>
      productsCatalogApi.saveProduct({ ...product, merchantId: merchant?.id ?? '' } as Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'totalOrders'>),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: PRODUCT_KEYS.list(merchant?.id ?? '') });
      Toast.show({ type: 'success', text1: t('merchant_app.product_saved') });
    },
    onError: () => Toast.show({ type: 'error', text1: t('errors.server') }),
  });
}

export function useDeleteProduct() {
  const user = useAppSelector(selectUser);
  const merchant = mockMerchants.find((m) => m.userId === user?.id);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: productsCatalogApi.deleteProduct,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: PRODUCT_KEYS.list(merchant?.id ?? '') });
    },
  });
}
