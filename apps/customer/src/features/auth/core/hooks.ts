import { useMutation } from '@tanstack/react-query';
import { authApi } from './api';
import { useAppDispatch } from '../../../store/hooks';
import { setAuth } from '../../../store/slices/auth.slice';
import { USE_MOCK_API } from '../../../core/api/config';
import { api } from '../../../core/api/client';

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
    onSuccess: async (res) => {
      dispatch(
        setAuth({
          user: res.data.user,
          accessToken: res.data.accessToken,
          refreshToken: res.data.refreshToken,
        }),
      );

      if (!USE_MOCK_API) {
        // Register FCM token
        try {
          const messaging = await import('@react-native-firebase/messaging');
          const fcmToken = await messaging.default().getToken();
          await api.patch('/users/me', { fcmToken });
        } catch {
          // FCM not configured — not a blocking error
        }
      }
    },
  });
}
