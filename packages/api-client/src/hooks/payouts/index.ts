import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useApiClient } from '../../client/provider';
import { QUERY_KEYS } from '../../constants/query-keys';
import { RequestPayoutDto } from '../../services/payout.service';

export function useMyPayouts() {
  const { payout } = useApiClient();
  return useQuery({
    queryKey: QUERY_KEYS.payouts.my,
    queryFn: () => payout.getMyPayouts(),
  });
}

export function useRequestPayout() {
  const { payout } = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: RequestPayoutDto) => payout.requestPayout(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.payouts.my });
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.wallet.balance });
    },
  });
}

// ── Admin Hooks ─────────────────────────────────────────────────────

export function useAdminPayouts() {
  const { payout } = useApiClient();
  return useQuery({
    queryKey: QUERY_KEYS.admin.payouts(),
    queryFn: () => payout.adminGetAll(),
  });
}

export function useAdminPayoutDetails(id: string) {
  const { payout } = useApiClient();
  return useQuery({
    queryKey: ['admin', 'payouts', id],
    queryFn: () => payout.adminGetDetails(id),
    enabled: !!id,
  });
}

export function useAdminApprovePayout() {
  const { payout } = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => payout.adminApprove(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['admin', 'payouts'] });
    },
  });
}

export function useAdminRejectPayout() {
  const { payout } = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      payout.adminReject(id, reason),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['admin', 'payouts'] });
    },
  });
}
