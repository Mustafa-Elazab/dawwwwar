import { useState, useCallback, useRef } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Animated } from 'react-native';
import { useTranslation } from '@dawwar/i18n';
import { useVerifyOtp, useSendOtp } from '../../core/hooks';
import { useOtpCountdown } from '../../hooks/useOtpCountdown';
import { AUTH_ROUTES } from '../../../../navigation/routes';
import type { OtpScreenNavProp, OtpScreenRouteProp } from './types';

export function useController() {
  const { t } = useTranslation();
  const navigation = useNavigation<OtpScreenNavProp>();
  const route = useRoute<OtpScreenRouteProp>();
  const { phone, returnTo } = route.params;

  // OTP string
  const [digits, setDigits] = useState('');
  const [otpError, setOtpError] = useState<string | null>(null);

  // Shake animation (triggered on wrong OTP)
  const shakeX = useRef(new Animated.Value(0)).current;

  const triggerShake = useCallback(() => {
    Animated.sequence([
      Animated.timing(shakeX, { toValue: -10, duration: 50, useNativeDriver: false }),
      Animated.timing(shakeX, { toValue: 10, duration: 100, useNativeDriver: false }),
      Animated.timing(shakeX, { toValue: -10, duration: 100, useNativeDriver: false }),
      Animated.timing(shakeX, { toValue: 10, duration: 100, useNativeDriver: false }),
      Animated.timing(shakeX, { toValue: -10, duration: 100, useNativeDriver: false }),
      Animated.timing(shakeX, { toValue: 10, duration: 100, useNativeDriver: false }),
      Animated.timing(shakeX, { toValue: 0, duration: 50, useNativeDriver: false }),
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
      
      if (res.isNewUser) {
        navigation.replace(AUTH_ROUTES.COMPLETE_PROFILE, { returnTo });
        return;
      }

      if (returnTo) {
        navigation.reset({
          index: 1,
          routes: [
            { name: 'CustomerTabs' },
            { name: returnTo as any },
          ],
        });
      } else {
        // Fallback if no returnTo: just go to tabs (RootNavigator will handle showing tabs)
        // Since setAuth was called in the hook, RootNavigator will swap to Main App
        // But if we are already in the "Auth" stack which is a screen in Root, 
        // we might want to pop or reset.
        navigation.reset({ index: 0, routes: [{ name: 'CustomerTabs' }] });
      }
    } catch (err: any) {
      console.error('[OtpScreen] verifyOtp error:', err);
      triggerShake();
      
      const status = err?.response?.status;
      const message = err?.response?.data?.message;

      if (status === 403) {
        setOtpError(message ?? t('errors.roleMismatch.merchantInCustomer'));
      } else if (err.message === 'INVALID_OTP') {
        setOtpError(t('auth.otp_invalid'));
      } else if (err.message === 'OTP_EXPIRED') {
        setOtpError(t('auth.otp_expired'));
      } else {
        setOtpError(t('errors.server'));
      }
      // Clear digits on error
      setDigits('');
    }
  },
  [phone, returnTo, verifyMutation, navigation, triggerShake, t],
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
      await sendOtpMutation.mutateAsync(phone);
      setDigits('');
      setOtpError(null);
      otpTimer.reset(120);
      resendTimer.reset(30);
    } catch (err) {
      console.error('[OtpScreen] handleResend error:', err);
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
    handleResend,
    handleBack: () => navigation.goBack(),
    // display
    phone,
    t,
  };
}
