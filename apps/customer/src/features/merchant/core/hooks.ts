import { useQuery } from '@tanstack/react-query';
import { merchantApi } from './api';

export const MERCHANT_KEYS = {
  detail: (id: string) => ['merchant', id] as const,
  products: (id: string) => ['merchant', id, 'products'] as const,
};

export function useMerchantDetail(id: string) {
  return useQuery({
    queryKey: MERCHANT_KEYS.detail(id),
    queryFn: () => merchantApi.getById(id),
    staleTime: 2 * 60_000,
    select: (res) => res.data,
  });
}

export function useMerchantProducts(merchantId: string) {
  return useQuery({
    queryKey: MERCHANT_KEYS.products(merchantId),
    queryFn: () => merchantApi.getProducts(merchantId),
    staleTime: 2 * 60_000,
    select: (res) => res.data,
  });
}
