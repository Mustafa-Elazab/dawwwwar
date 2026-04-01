import { useQuery } from '@tanstack/react-query';
import { ordersApi } from './api';
import { useAppSelector } from '../../../store/hooks';
import { selectUser } from '../../../store/slices/auth.slice';
import { ACTIVE_ORDER_STATUSES, TERMINAL_ORDER_STATUSES } from '@dawwar/types';

export const ORDER_KEYS = {
  myOrders: (userId: string) => ['orders', 'mine', userId] as const,
  detail: (id: string) => ['orders', id] as const,
};

export function useMyOrders() {
  const user = useAppSelector(selectUser);
  return useQuery({
    queryKey: ORDER_KEYS.myOrders(user?.id ?? ''),
    queryFn: () => ordersApi.getMyOrders(user?.id ?? ''),
    enabled: !!user?.id,
    staleTime: 30_000,
    select: (res) => res.data,
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
