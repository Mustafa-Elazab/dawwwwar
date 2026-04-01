import { useState, useCallback, useRef } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Animated } from 'react-native';
import { useTranslation } from '@dawwar/i18n';
import { useVerifyOtp, useSendOtp } from '../../core/hooks';
import { useOtpCountdown } from '../../hooks/useOtpCountdown';
import { AUTH_ROUTES } from '../../navigation/route';
import type { OtpScreenNavProp, OtpScreenRouteProp } from './types';

export function useController() {
  const { t } = useTranslation();
  const navigation = useNavigation<OtpScreenNavProp>();
  const route = useRoute<OtpScreenRouteProp>();
  const { phone } = route.params;

  // 6-element array — one per box
  const [digits, setDigits] = useState<string[]>(Array(6).fill(''));
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
    async (codeDigits: string[]) => {
      const code = codeDigits.join('');
      if (code.length < 6) return;

      setOtpError(null);
      try {
        const res = await verifyMutation.mutateAsync({ phone, code });
        // verifyOtp onSuccess dispatches setAuth → RootNavigator re-renders
        if (res.data.isFirstLogin) {
          navigation.navigate(AUTH_ROUTES.ROLE);
        }
        // If not first login: RootNavigator auth guard handles redirect automatically
      } catch (err) {
        const error = err as Error;
        triggerShake();
        if (error.message === 'INVALID_OTP') {
          setOtpError(t('auth.otp_invalid'));
        } else if (error.message === 'OTP_EXPIRED') {
          setOtpError(t('auth.otp_expired'));
        } else {
          setOtpError(t('errors.server'));
        }
        // Clear digits on error
        setDigits(Array(6).fill(''));
      }
    },
    [phone, verifyMutation, navigation, triggerShake, t],
  );

  const handleDigitChange = useCallback(
    (index: number, char: string) => {
      const next = [...digits];
      next[index] = char;
      setDigits(next);
      setOtpError(null);
      // Auto-submit when all 6 boxes filled
      if (next.every((d) => d !== '') && index === 5) {
        void submitOtp(next);
      }
    },
    [digits, submitOtp],
  );

  const handleBackspace = useCallback(
    (index: number) => {
      const next = [...digits];
      next[index] = '';
      setDigits(next);
    },
    [digits],
  );

  const handleResend = useCallback(async () => {
    if (!resendTimer.isExpired) return;
    try {
      await sendOtpMutation.mutateAsync({ phone });
      setDigits(Array(6).fill(''));
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
    handleDigitChange,
    handleBackspace,
    handleResend,
    // display
    phone,
    t,
  };
}
