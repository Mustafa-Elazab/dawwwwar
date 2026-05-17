import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useApiClient } from '../../client/provider';
import { QUERY_KEYS } from '../../constants/query-keys';
import {
  PlaceOrderDto,
  PlaceCustomOrderDto,
  AcceptOrderDto,
  RejectOrderDto,
  UpdateDeliveryStatusDto,
} from '../../types/order.types';

// ── Customer Hooks ──────────────────────────────────────────────────

export function useMyOrders(filter = 'all') {
  const { orders } = useApiClient();
  return useQuery({
    queryKey: QUERY_KEYS.orders.list(filter),
    queryFn: () => orders.getMyOrders(),
  });
}

export function useOrderDetails(id: string) {
  const { orders } = useApiClient();
  return useQuery({
    queryKey: QUERY_KEYS.orders.detail(id),
    queryFn: () => orders.getOrderById(id),
    enabled: !!id,
  });
}

export function usePlaceOrder() {
  const { orders } = useApiClient();
  return useMutation({
    mutationFn: (data: PlaceOrderDto) => orders.placeOrder(data),
  });
}

export function usePlaceCustomOrder() {
  const { orders } = useApiClient();
  return useMutation({
    mutationFn: (data: PlaceCustomOrderDto) => orders.placeCustomOrder(data),
  });
}

export function useCancelOrder() {
  const { orders } = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => orders.cancelOrder(id),
    onSuccess: (_, id) => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.orders.detail(id) });
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.orders.list('all') });
    },
  });
}

// ── Merchant Hooks ──────────────────────────────────────────────────

export function useMerchantOrders() {
  const { orders } = useApiClient();
  return useQuery({
    queryKey: QUERY_KEYS.orders.list('merchant'),
    queryFn: () => orders.getMerchantOrders(),
  });
}

export function useMerchantAcceptOrder() {
  const { orders } = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: AcceptOrderDto }) =>
      orders.merchantAcceptOrder(id, payload),
    onSuccess: (_, { id }) => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.orders.detail(id) });
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.orders.list('merchant') });
    },
  });
}

export function useMerchantRejectOrder() {
  const { orders } = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: RejectOrderDto }) =>
      orders.merchantRejectOrder(id, payload),
    onSuccess: (_, { id }) => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.orders.detail(id) });
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.orders.list('merchant') });
    },
  });
}

export function useMerchantMarkReady() {
  const { orders } = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => orders.merchantMarkReady(id),
    onSuccess: (_, id) => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.orders.detail(id) });
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.orders.list('merchant') });
    },
  });
}

// ── Driver Hooks ────────────────────────────────────────────────────

export function useAvailableOrders() {
  const { orders } = useApiClient();
  return useQuery({
    queryKey: QUERY_KEYS.orders.list('available'),
    queryFn: () => orders.getAvailableOrders(),
  });
}

export function useActiveOrder() {
  const { orders } = useApiClient();
  return useQuery({
    queryKey: QUERY_KEYS.orders.active,
    queryFn: () => orders.getActiveOrder(),
  });
}

export function useDriverAcceptOrder() {
  const { orders } = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => orders.driverAcceptOrder(id),
    onSuccess: (_, id) => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.orders.detail(id) });
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.orders.active });
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.orders.list('available') });
    },
  });
}

export function useDriverDeclineOrder() {
  const { orders } = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => orders.driverDeclineOrder(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.orders.list('available') });
    },
  });
}

export function useUpdateDeliveryStatus() {
  const { orders } = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateDeliveryStatusDto }) =>
      orders.updateDeliveryStatus(id, payload),
    onSuccess: (_, { id }) => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.orders.detail(id) });
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.orders.active });
    },
  });
}
