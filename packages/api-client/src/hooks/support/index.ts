import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useApiClient } from '../../client/provider';
import { QUERY_KEYS } from '../../constants/query-keys';

export function useMyTickets() {
  const { support } = useApiClient();
  return useQuery({
    queryKey: QUERY_KEYS.support.my,
    queryFn: () => support.getMyTickets(),
  });
}

export function useTicketDetails(id: string) {
  const { support } = useApiClient();
  return useQuery({
    queryKey: QUERY_KEYS.support.detail(id),
    queryFn: () => support.getTicketDetails(id),
    enabled: !!id,
  });
}

export function useCreateTicket() {
  const { support } = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: any) => support.createTicket(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.support.my });
    },
  });
}

export function useAddTicketMessage() {
  const { support } = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: any }) => support.addMessage(id, payload),
    onSuccess: (_, { id }) => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.support.detail(id) });
    },
  });
}

// ── Admin Hooks ─────────────────────────────────────────────────────

export function useAdminTickets(status?: string) {
  const { support } = useApiClient();
  return useQuery({
    queryKey: QUERY_KEYS.admin.tickets(status),
    queryFn: () => support.adminGetAll(status),
  });
}

export function useAdminResolveTicket() {
  const { support } = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: any }) => support.adminResolve(id, payload),
    onSuccess: (_, { id }) => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.admin.tickets() });
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.support.detail(id) });
    },
  });
}
