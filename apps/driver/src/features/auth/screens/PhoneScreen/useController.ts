import { useState, useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from '@dawwar/i18n';
import { useSendOtp } from '../../core/hooks';
import { isValidEgyptianPhone, normalizePhone } from '../../utils/phone';
import { AUTH_ROUTES } from '../../navigation/route';
import type { PhoneScreenNavProp } from './types';

export function useController() {
  const { t } = useTranslation();
  const navigation = useNavigation<PhoneScreenNavProp>();

  const [phone, setPhone] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [phoneError, setPhoneError] = useState<string | null>(null);

  const sendOtpMutation = useSendOtp();

  // Inline validation as user types
  const handlePhoneChange = useCallback((value: string) => {
    // Only allow digits, max 11 chars
    const digits = value.replace(/\D/g, '').slice(0, 11);
    setPhone(digits);
    // Clear error when user starts correcting
    if (phoneError) setPhoneError(null);
  }, [phoneError]);

  const handleSendOtp = useCallback(async () => {
    const normalized = normalizePhone(phone);

    // Validate before API call
    if (!isValidEgyptianPhone(phone)) {
      setPhoneError(t('auth.phone_invalid'));
      return;
    }
    if (!termsAccepted) {
      setPhoneError(t('auth.terms_required'));
      return;
    }

    try {
      await sendOtpMutation.mutateAsync({ phone: normalized });
      navigation.navigate(AUTH_ROUTES.OTP, { phone: normalized });
    } catch (err) {
      const error = err as Error;
      if (error.message === 'INVALID_PHONE') {
        setPhoneError(t('auth.phone_invalid'));
      } else {
        setPhoneError(t('errors.server'));
      }
    }
  }, [phone, termsAccepted, sendOtpMutation, navigation, t]);

  const isButtonDisabled =
    phone.length < 11 || !termsAccepted || sendOtpMutation.isPending;

  return {
    // state
    phone,
    termsAccepted,
    phoneError,
    isLoading: sendOtpMutation.isPending,
    isButtonDisabled,
    // handlers
    handlePhoneChange,
    handleTermsToggle: () => setTermsAccepted((v) => !v),
    handleSendOtp,
    // i18n
    t,
  };
}
