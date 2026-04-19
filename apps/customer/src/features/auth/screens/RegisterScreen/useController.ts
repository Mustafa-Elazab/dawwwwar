import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from '@dawwar/i18n';
import * as z from 'zod';
import { useState } from 'react';
import type { AuthStackParamList } from '../../../../navigation/types';
import { AUTH_ROUTES } from '../../../../navigation/routes';
import { useSendOtp } from '../../core/hooks';
import { normalizePhone, isValidEgyptianPhone } from '../../utils/phone';

const registerSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    phone: z
      .string()
      .min(10, 'Phone number must be at least 10 digits')
      .refine((v) => isValidEgyptianPhone(v), 'Enter a valid Egyptian mobile number'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(6, 'Confirm password must be at least 6 characters'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

export const useController = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<StackNavigationProp<AuthStackParamList>>();
  const sendOtpMutation = useSendOtp();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      phone: '',
      password: '',
      confirmPassword: '',
    },
    mode: 'onChange',
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setServerError(null);
    const normalized = normalizePhone(data.phone);
    try {
      // Send OTP first — mock validates the phone format
      await sendOtpMutation.mutateAsync({ phone: normalized });
      navigation.navigate(AUTH_ROUTES.OTP, { phone: normalized, context: 'signup' });
    } catch (err) {
      const error = err as Error;
      if (error.message === 'INVALID_PHONE') {
        setServerError(t('auth.phone_invalid'));
      } else {
        setServerError(t('errors.server'));
      }
    }
  };

  const handleGoToLogin = () => {
    navigation.navigate(AUTH_ROUTES.LOGIN);
  };

  return {
    control,
    handleSubmit,
    errors,
    isValid,
    isLoading: sendOtpMutation.isPending,
    serverError,
    onSubmit,
    handleGoToLogin,
    t,
  };
};
