import { useSendOtp as useBaseSendOtp, useVerifyOtp as useBaseVerifyOtp } from '@dawwar/api-client';
import { useAppDispatch } from '../../../store/hooks';
import { setAuth } from '../../../store/slices/auth.slice';
import { USE_MOCK_API } from '../../../core/api/config';
import { api } from '../../../core/api/client';

export function useSendOtp() {
  return useBaseSendOtp();
}

export function useVerifyOtp() {
  const dispatch = useAppDispatch();
  const mutation = useBaseVerifyOtp();

  return {
    ...mutation,
    mutateAsync: async (params: { phone: string; code: string }) => {
      const res = await mutation.mutateAsync(params);
      
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
      
      return res;
    }
  };
}
