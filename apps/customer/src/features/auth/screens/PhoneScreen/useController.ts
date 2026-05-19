import { useState, useCallback } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTranslation } from '@dawwar/i18n';
import { useSendOtp } from '../../core/hooks';
import { AUTH_ROUTES, PROFILE_ROUTES } from '../../../../navigation/routes';
import type { PhoneScreenNavProp, PhoneScreenRouteProp } from './types';

export function useController() {
  const { t } = useTranslation();
  const navigation = useNavigation<PhoneScreenNavProp>();
  const route = useRoute<PhoneScreenRouteProp>();
  const returnTo = route.params?.returnTo;

  const [phone, setPhone] = useState('');
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const sendOtpMutation = useSendOtp();

  const handlePhoneChange = useCallback((text: string) => {
    const cleaned = text.replace(/[^0-9]/g, '');
    setPhone(cleaned);
    setPhoneError(null);
  }, []);

  const handleTermsToggle = useCallback(() => {
    setTermsAccepted((prev) => !prev);
  }, []);

  const handleTermsPress = useCallback(() => {
    navigation.navigate(PROFILE_ROUTES.TERMS);
  }, [navigation]);

  const handlePrivacyPress = useCallback(() => {
    navigation.navigate(PROFILE_ROUTES.PRIVACY);
  }, [navigation]);

  const handleSendOtp = useCallback(async () => {
    // Basic Egyptian phone validation: starts with 01 and exactly 11 digits
    const isValidEgyptianPhone = /^01[0125][0-9]{8}$/.test(phone);
    if (!isValidEgyptianPhone) {
      setPhoneError(t('errors.invalid_phone'));
      return;
    }
    if (!termsAccepted) return;

    try {
      await sendOtpMutation.mutateAsync(phone);
      navigation.navigate(AUTH_ROUTES.OTP, { phone, returnTo });
    } catch (err) {
      console.error('[PhoneScreen] sendOtp error:', err);
      setPhoneError(t('errors.server'));
    }
  }, [phone, termsAccepted, sendOtpMutation, navigation, t]);

  return {
    phone,
    phoneError,
    termsAccepted,
    isLoading: sendOtpMutation.isPending,
    isButtonDisabled: phone.length < 11 || !termsAccepted || sendOtpMutation.isPending,
    handlePhoneChange,
    handleTermsToggle,
    handleTermsPress,
    handlePrivacyPress,
    handleSendOtp,
    t,
  };
}
