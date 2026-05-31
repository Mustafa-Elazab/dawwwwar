import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ordersApi } from './api';
import { useAppSelector } from '../../../store/hooks';
import { selectUser } from '../../../store/slices/auth.slice';
import { ACTIVE_ORDER_STATUSES, TERMINAL_ORDER_STATUSES } from '@dawwar/types';
import Toast from 'react-native-toast-message';
import { useTranslation } from '@dawwar/i18n';

export const ORDER_KEYS = {
  myOrders: (userId: string) => ['orders', 'mine', userId] as const,
  detail: (id: string) => ['orders', id] as const,
};

export function useMyOrders() {
  const user = useAppSelector(selectUser);
  return useQuery({
    queryKey: ORDER_KEYS.myOrders(user?.id ?? ''),
    queryFn: () => ordersApi.getMyOrders(),
    enabled: !!user?.id,
    staleTime: 30_000,
    select: (res) => (Array.isArray(res) ? res : res.data),
  });
}

export function useActiveOrders() {
  const { data: all, ...rest } = useMyOrders();
  return {
    ...rest,
    data: all?.filter((o) => ACTIVE_ORDER_STATUSES.includes(o.status)) ?? [],
  };
}

export function usePastOrders() {
  const { data: all, ...rest } = useMyOrders();
  return {
    ...rest,
    data: all?.filter((o) => TERMINAL_ORDER_STATUSES.includes(o.status)) ?? [],
  };
}

export function useOrderDetail(orderId: string) {
  return useQuery({
    queryKey: ORDER_KEYS.detail(orderId),
    queryFn: () => ordersApi.getById(orderId),
    enabled: !!orderId,
    staleTime: 30_000,
    select: (res) => (res && typeof res === 'object' && 'data' in res ? res.data : res),
  });
}

export function useCancelOrder() {
  const queryClient = useQueryClient();
  const user = useAppSelector(selectUser);
  const { t } = useTranslation();

  return useMutation({
    mutationFn: ({ orderId, reason }: { orderId: string; reason?: string }) =>
      ordersApi.cancelOrder(orderId, reason),
    onSuccess: (_res, variables) => {
      void queryClient.invalidateQueries({ queryKey: ORDER_KEYS.detail(variables.orderId) });
      void queryClient.invalidateQueries({ queryKey: ORDER_KEYS.myOrders(user?.id ?? '') });
    },
    onError: () => {
      Toast.show({ type: 'error', text1: t('errors.cancel_failed') });
    },
  });
}
