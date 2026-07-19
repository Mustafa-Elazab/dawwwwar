import { useState, useCallback, useRef } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Animated } from 'react-native';
import { useTranslation } from '@dawwar/i18n';
import { useVerifyOtp, useSendOtp } from '../../core/hooks';
import { useOtpCountdown } from '../../hooks/useOtpCountdown';
import { AUTH_ROUTES } from '../../../../navigation/routes';
import type { OtpScreenNavProp, OtpScreenRouteProp } from './types';
import type { ApiResponse } from '@dawwar/types';
import type { VerifyOtpResponse } from '../../core/response';

const unwrap = (res: ApiResponse<VerifyOtpResponse> | VerifyOtpResponse): VerifyOtpResponse =>
  res && typeof res === 'object' && 'data' in res ? res.data : res;

export function useController() {
  const { t } = useTranslation();
  const navigation = useNavigation<OtpScreenNavProp>();
  const route = useRoute<OtpScreenRouteProp>();
  const { phone } = route.params;

  const [digits, setDigits] = useState('');
  const [otpError, setOtpError] = useState<string | null>(null);

  // Shake animation (triggered on wrong OTP)
  const shakeX = useRef(new Animated.Value(0)).current;

  const triggerShake = useCallback(() => {
    Animated.sequence([
      Animated.timing(shakeX, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeX, { toValue: 10, duration: 100, useNativeDriver: true }),
      Animated.timing(shakeX, { toValue: -10, duration: 100, useNativeDriver: true }),
      Animated.timing(shakeX, { toValue: 10, duration: 100, useNativeDriver: true }),
      Animated.timing(shakeX, { toValue: -10, duration: 100, useNativeDriver: true }),
      Animated.timing(shakeX, { toValue: 10, duration: 100, useNativeDriver: true }),
      Animated.timing(shakeX, { toValue: 0, duration: 50, useNativeDriver: true }),
    ]).start();
  }, [shakeX]);

  // Main OTP countdown (120 seconds)
  const otpTimer = useOtpCountdown({ initialSeconds: 120 });

  // Resend lockout countdown (30 seconds)
  const resendTimer = useOtpCountdown({ initialSeconds: 30 });

  const verifyMutation = useVerifyOtp();
  const sendOtpMutation = useSendOtp();

  const submitOtp = useCallback(
    async (code: string) => {
      if (code.length < 6) return;

      setOtpError(null);
      try {
        const res = await verifyMutation.mutateAsync({ phone, code });
        const payload = unwrap(res);
        // verifyOtp onSuccess dispatches setAuth → RootNavigator re-renders
        if (payload.isFirstLogin) {
          navigation.navigate(AUTH_ROUTES.ROLE);
        }
        // If not first login: RootNavigator auth guard handles redirect automatically
      } catch (err: any) {
        console.error('[OtpScreen] verifyOtp error:', err);
        triggerShake();

        const status = err?.response?.status;
        const message = err?.response?.data?.message;

        if (status === 403) {
          setOtpError(message ?? t('errors.roleMismatch.customerInDriver'));
        } else if (err.message === 'INVALID_OTP') {
          setOtpError(t('auth.otp_invalid'));
        } else if (err.message === 'OTP_EXPIRED') {
          setOtpError(t('auth.otp_expired'));
        } else {
          setOtpError(t('errors.server'));
        }
        setDigits('');
      }
    },
    [phone, verifyMutation, navigation, triggerShake, t],
  );

  const handleOtpChange = useCallback(
    (code: string) => {
      setDigits(code);
      setOtpError(null);
      if (code.length === 6) {
        void submitOtp(code);
      }
    },
    [submitOtp],
  );

  const handleResend = useCallback(async () => {
    if (!resendTimer.isExpired) return;
    try {
      await sendOtpMutation.mutateAsync({ phone });
      setDigits('');
      setOtpError(null);
      otpTimer.reset(120);
      resendTimer.reset(30);
    } catch {
      setOtpError(t('errors.server'));
    }
  }, [resendTimer, sendOtpMutation, phone, otpTimer, t]);

  return {
    // state
    digits,
    otpError,
    isLoading: verifyMutation.isPending,
    shakeX,
    timerSeconds: otpTimer.seconds,
    isOtpExpired: otpTimer.isExpired,
    canResend: resendTimer.isExpired,
    resendSeconds: resendTimer.seconds,
    // handlers
    handleOtpChange,
    handleBack: () => navigation.goBack(),
    handleResend,
    // display
    phone,
    t,
  };
}
