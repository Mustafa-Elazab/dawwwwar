import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { activeDeliveryApi } from './api';
import type { OrderStatus } from '@dawwar/types';

export const DELIVERY_KEYS = {
  order: (id: string) => ['active-delivery', id] as const,
};

export function useActiveOrder(orderId: string) {
  return useQuery({
    queryKey: DELIVERY_KEYS.order(orderId),
    queryFn: () => activeDeliveryApi.getOrderById(orderId),
    select: (res) => res.data,
    staleTime: 10_000,
    refetchInterval: 10_000, // poll every 10s for status changes
  });
}

export function useUpdateStatus(orderId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      status,
      extra,
    }: {
      status: OrderStatus;
      extra?: { actualAmount?: number; receiptImage?: string };
    }) => activeDeliveryApi.updateStatus(orderId, status, extra),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: DELIVERY_KEYS.order(orderId) });
    },
  });
}

export function useSendPhotos(orderId: string) {
  return useMutation({
    mutationFn: (photoUris: string[]) =>
      activeDeliveryApi.sendShoppingPhotos(orderId, photoUris),
  });
}
