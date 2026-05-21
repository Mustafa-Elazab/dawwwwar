import { useState, useCallback } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSharedValue, withSequence, withTiming } from 'react-native-reanimated';
import { easings, motion } from '@dawwar/theme';
import { useTranslation } from '@dawwar/i18n';
import { useVerifyOtp, useSendOtp } from '../../core/hooks';
import { useOtpCountdown } from '../../hooks/useOtpCountdown';
import {
  AUTH_ROUTES,
  MODAL_ROUTES,
  PROFILE_ROUTES,
  TAB_ROUTES,
  WALLET_ROUTES,
} from '../../../../navigation/routes';
import type { RootParamList } from '../../../../navigation/types';
import type { StackNavigationProp } from '@react-navigation/stack';
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
  const shakeX = useSharedValue(0);

  const triggerShake = useCallback(() => {
    const step = (value: number) =>
      withTiming(value, { duration: motion.shakeMs, easing: easings.standard });

    shakeX.value = withSequence(
      step(-10),
      step(10),
      step(-10),
      step(10),
      step(-6),
      step(6),
      step(0),
    );
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

        if (res.isFirstLogin) {
          navigation.replace(AUTH_ROUTES.COMPLETE_PROFILE, { returnTo });
          return;
        }

        const rootNavigation = navigation.getParent<StackNavigationProp<RootParamList>>();

        if (returnTo) {
          if (rootNavigation) {
            if (returnTo === 'checkout') {
              rootNavigation.reset({
                index: 1,
                routes: [{ name: 'CustomerTabs' }, { name: MODAL_ROUTES.CHECKOUT }],
              });
              return;
            }

            if (returnTo === 'orders') {
              rootNavigation.reset({
                index: 0,
                routes: [{ name: 'CustomerTabs', params: { screen: TAB_ROUTES.ORDERS_TAB } }],
              });
              return;
            }

            if (returnTo === 'wallet') {
              rootNavigation.reset({
                index: 0,
                routes: [
                  {
                    name: 'CustomerTabs',
                    params: {
                      screen: TAB_ROUTES.PROFILE_TAB,
                      params: { screen: WALLET_ROUTES.WALLET },
                    },
                  },
                ],
              });
              return;
            }

            if (returnTo === 'address') {
              rootNavigation.reset({
                index: 0,
                routes: [
                  {
                    name: 'CustomerTabs',
                    params: {
                      screen: TAB_ROUTES.PROFILE_TAB,
                      params: { screen: PROFILE_ROUTES.ADDRESSES },
                    },
                  },
                ],
              });
              return;
            }
          }

          rootNavigation?.reset({ index: 0, routes: [{ name: 'CustomerTabs' }] });
        } else {
          rootNavigation?.reset({ index: 0, routes: [{ name: 'CustomerTabs' }] });
        }
      } catch (err: unknown) {
        console.error('[OtpScreen] verifyOtp error:', err);
        triggerShake();

        const maybeErr = err as {
          response?: { status?: number; data?: { message?: string } };
          message?: string;
        };
        const status = maybeErr.response?.status;
        const message = maybeErr.response?.data?.message;

        if (status === 403) {
          setOtpError(message ?? t('errors.roleMismatch.merchantInCustomer'));
        } else if (maybeErr.message === 'INVALID_OTP') {
          setOtpError(t('auth.otp_invalid'));
        } else if (maybeErr.message === 'OTP_EXPIRED') {
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
