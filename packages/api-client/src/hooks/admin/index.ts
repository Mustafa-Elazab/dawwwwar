import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useApiClient } from '../../client/provider';
import { QUERY_KEYS } from '../../constants/query-keys';

export function useAdminMerchants(status?: 'pending' | 'approved') {
  const { admin } = useApiClient();
  return useQuery({
    queryKey: QUERY_KEYS.admin.merchants(status),
    queryFn: () => admin.getMerchants(status),
  });
}

export function useApproveMerchant() {
  const { admin } = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => admin.approveMerchant(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['admin', 'merchants'] });
    },
  });
}

export function useRejectMerchant() {
  const { admin } = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      admin.rejectMerchant(id, reason),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['admin', 'merchants'] });
    },
  });
}

// ── Orders ──────────────────────────────────────────────────────────

export function useAdminOrders(status?: 'active' | 'all') {
  const { admin } = useApiClient();
  return useQuery({
    queryKey: QUERY_KEYS.admin.orders(status),
    queryFn: () => admin.getOrders(status),
  });
}

export function useAdminCancelOrder() {
  const { admin } = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => admin.cancelOrder(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['admin', 'orders'] });
    },
  });
}

// ── Drivers ─────────────────────────────────────────────────────────

export function useAdminDrivers(status?: 'all' | 'online' | 'pending') {
  const { admin } = useApiClient();
  return useQuery({
    queryKey: ['admin', 'drivers', { status }],
    queryFn: () => admin.getDrivers(status),
  });
}

export function useApproveDriver() {
  const { admin } = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => admin.approveDriver(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['admin', 'drivers'] });
    },
  });
}

export function useForceDriverOffline() {
  const { admin } = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => admin.forceDriverOffline(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['admin', 'drivers'] });
    },
  });
}

// ── Customers ───────────────────────────────────────────────────────

export function useAdminCustomers() {
  const { admin } = useApiClient();
  return useQuery({
    queryKey: ['admin', 'customers'],
    queryFn: () => admin.getCustomers(),
  });
}

// ── Promo Codes ─────────────────────────────────────────────────────

export function useAdminPromos() {
  const { admin } = useApiClient();
  return useQuery({
    queryKey: ['admin', 'promos'],
    queryFn: () => admin.getPromos(),
  });
}
