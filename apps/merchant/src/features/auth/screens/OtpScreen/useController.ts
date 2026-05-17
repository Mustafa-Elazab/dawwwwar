import { useState, useCallback, useRef } from 'react';
import { CommonActions, useNavigation, useRoute } from '@react-navigation/native';
import { Animated } from 'react-native';
import { useTranslation } from '@dawwar/i18n';
import { useVerifyOtp, useSendOtp } from '../../core/hooks';
import { useOtpCountdown } from '../../hooks/useOtpCountdown';
import type { OtpScreenNavProp, OtpScreenRouteProp } from './types';

export function useController() {
  const { t } = useTranslation();
  const navigation = useNavigation<OtpScreenNavProp>();
  const route = useRoute<OtpScreenRouteProp>();
  const { phone } = route.params;

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
        await verifyMutation.mutateAsync({ phone, code });
        
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: 'CreateStoreScreen' }],
          })
        );
      } catch (err) {
        console.error('[OtpScreen] verifyOtp error:', err);
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
        setDigits('');
      }
    },
    [phone, verifyMutation, triggerShake, t],
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