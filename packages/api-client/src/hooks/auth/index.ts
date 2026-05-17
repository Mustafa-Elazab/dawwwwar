import { useMutation, useQuery } from '@tanstack/react-query';
import { useApiClient } from '../../client/provider';
import { QUERY_KEYS } from '../../constants/query-keys';

export function useGetMe() {
  const { auth } = useApiClient();
  return useQuery({
    queryKey: QUERY_KEYS.auth.me,
    queryFn: () => auth.getMe(),
  });
}

export function useSendOtp() {
  const { auth } = useApiClient();
  return useMutation({
    mutationFn: (phone: string) => auth.sendOtp(phone),
  });
}

export function useVerifyOtp() {
  const { auth } = useApiClient();
  return useMutation({
    mutationFn: ({ phone, code }: { phone: string; code: string }) =>
      auth.verifyOtp(phone, code),
  });
}

export function useLogout() {
  const { auth } = useApiClient();
  return useMutation({
    mutationFn: () => auth.logout(),
  });
}

export function useSelectRole() {
  const { auth } = useApiClient();
  return useMutation({
    mutationFn: (role: string) => auth.selectRole(role),
  });
}
