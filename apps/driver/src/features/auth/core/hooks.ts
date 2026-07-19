import { useMutation } from '@tanstack/react-query';
import { authApi } from './api';
import { useAppDispatch } from '../../../store/hooks';
import { setAuth } from '../../../store/slices/auth.slice';
import { USE_MOCK_API } from '../../../core/api/config';
import apiClient from '../../../core/api/client';
import type { ApiResponse } from '@dawwar/types';
import type { VerifyOtpResponse } from './response';

const unwrap = (res: ApiResponse<VerifyOtpResponse> | VerifyOtpResponse): VerifyOtpResponse =>
  res && typeof res === 'object' && 'data' in res ? res.data : res;

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
      const payload = unwrap(res);
      dispatch(
        setAuth({
          user: payload.user,
          accessToken: payload.accessToken,
          refreshToken: payload.refreshToken,
        }),
      );

      if (!USE_MOCK_API) {
        // Register FCM token
        try {
          const messaging = await import('@react-native-firebase/messaging');
          const fcmToken = await messaging.default().getToken();
          await apiClient.patch('/users/me', { fcmToken });
        } catch {
          // FCM not configured — not a blocking error
        }
      }
    },
  });
}
