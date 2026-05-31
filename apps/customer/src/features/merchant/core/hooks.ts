import { useQuery } from '@tanstack/react-query';
import { merchantApi } from './api';

const unwrap = <T,>(res: T | { data: T }): T =>
  res && typeof res === 'object' && 'data' in res ? res.data : (res as T);

export const MERCHANT_KEYS = {
  detail: (id: string) => ['merchant', id] as const,
  products: (id: string) => ['merchant', id, 'products'] as const,
};

export function useMerchantDetail(id: string) {
  return useQuery({
    queryKey: MERCHANT_KEYS.detail(id),
    queryFn: () => merchantApi.getById(id),
    staleTime: 2 * 60_000,
    select: (res) => unwrap(res),
  });
}

export function useMerchantProducts(merchantId: string) {
  return useQuery({
    queryKey: MERCHANT_KEYS.products(merchantId),
    queryFn: () => merchantApi.getProducts(merchantId),
    staleTime: 2 * 60_000,
    select: (res) => unwrap(res),
  });
}
