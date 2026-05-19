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

export function useVerifyCustomerOtp() {
  const { auth } = useApiClient();
  return useMutation({
    mutationFn: ({ phone, code }: { phone: string; code: string }) =>
      auth.verifyCustomerOtp(phone, code),
  });
}

export function useVerifyMerchantOtp() {
  const { auth } = useApiClient();
  return useMutation({
    mutationFn: ({ phone, code }: { phone: string; code: string }) =>
      auth.verifyMerchantOtp(phone, code),
  });
}

export function useVerifyDriverOtp() {
  const { auth } = useApiClient();
  return useMutation({
    mutationFn: ({ phone, code }: { phone: string; code: string }) =>
      auth.verifyDriverOtp(phone, code),
  });
}

export function useVerifyAdminOtp() {
  const { auth } = useApiClient();
  return useMutation({
    mutationFn: ({ phone, code }: { phone: string; code: string }) =>
      auth.verifyAdminOtp(phone, code),
  });
}

export function useLogout() {
  const { auth } = useApiClient();
  return useMutation({
    mutationFn: () => auth.logout(),
  });
}
