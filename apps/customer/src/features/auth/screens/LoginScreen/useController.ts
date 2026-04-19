import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from '@dawwar/i18n';
import * as z from 'zod';
import type { AuthStackParamList } from '../../../../navigation/types';
import { AUTH_ROUTES } from '../../../../navigation/routes';
import { useSendOtp } from '../../core/hooks';
import { normalizePhone, isValidEgyptianPhone } from '../../utils/phone';
import { useState } from 'react';

const loginSchema = z.object({
  phone: z
    .string()
    .min(10, 'Phone number must be at least 10 digits')
    .refine((v) => isValidEgyptianPhone(v), 'Enter a valid Egyptian mobile number'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export const useController = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<StackNavigationProp<AuthStackParamList>>();
  const sendOtpMutation = useSendOtp();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      phone: '',
      password: '',
    },
    mode: 'onChange',
  });

  const onSubmit = async (data: LoginFormValues) => {
    setServerError(null);
    const normalized = normalizePhone(data.phone);
    try {
      // Send OTP first — mock validates the phone format
      await sendOtpMutation.mutateAsync({ phone: normalized });
      navigation.navigate(AUTH_ROUTES.OTP, { phone: normalized, context: 'login' });
    } catch (err) {
      const error = err as Error;
      if (error.message === 'INVALID_PHONE') {
        setServerError(t('auth.phone_invalid'));
      } else {
        setServerError(t('errors.server'));
      }
    }
  };

  const handleGoToRegister = () => {
    navigation.navigate(AUTH_ROUTES.REGISTER);
  };

  return {
    control,
    handleSubmit,
    errors,
    isValid,
    isLoading: sendOtpMutation.isPending,
    serverError,
    onSubmit,
    handleGoToRegister,
    t,
  };
};
