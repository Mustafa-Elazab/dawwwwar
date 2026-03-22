import { useMutation } from '@tanstack/react-query';
import { authApi } from './api';
import { useAppDispatch } from '../../../store/hooks';
import { setAuth } from '../../../store/slices/auth.slice';

export function useSendOtp() {
  return useMutation({
    mutationFn: ({ phone }: { phone: string }) => authApi.sendOtp(phone),
  });
}

export function useVerifyOtp() {
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: ({ phone, code }: { phone: string; code: string }) =>
      authApi.verifyOtp(phone, code),
    onSuccess: (res) => {
      dispatch(
        setAuth({
          user: res.data.user,
          accessToken: res.data.accessToken,
          refreshToken: res.data.refreshToken,
        }),
      );
    },
  });
}
