import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { merchantOrdersApi } from './api';
import type { Order } from '@dawwar/types';

export const MERCHANT_ORDER_KEYS = {
  orders: (merchantId: string) => ['merchant', 'orders', merchantId] as const,
};

interface UseAcceptOrderOptions {
  mutationFn: (params: { orderId: string; prepMinutes: number }) => Promise<{ data: Order }>;
  onSuccess?: () => void;
  onError?: () => void;
}

interface UseRejectOrderOptions {
  mutationFn: (params: { orderId: string; reason: string }) => Promise<{ data: Order }>;
  onSuccess?: () => void;
  onError?: () => void;
}

export function useOrders(merchantId: string) {
  return useQuery({
    queryKey: MERCHANT_ORDER_KEYS.orders(merchantId),
    queryFn: () => merchantOrdersApi.getOrders(merchantId),
    enabled: !!merchantId,
    staleTime: 30_000,
    select: (res) => res.data,
  });
}

export function useAcceptOrder(options: UseAcceptOrderOptions) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: options.mutationFn,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['merchant', 'orders'] });
      options.onSuccess?.();
    },
    onError: options.onError,
  });
}

export function useRejectOrder(options: UseRejectOrderOptions) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: options.mutationFn,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['merchant', 'orders'] });
      options.onSuccess?.();
    },
    onError: options.onError,
  });
}
