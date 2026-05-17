import { useState, useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useMutation } from '@tanstack/react-query';
import { useTranslation } from '@dawwar/i18n';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import { updateUser, selectUser } from '../../../../store/slices/auth.slice';
import { AUTH_ROUTES } from '../../../../navigation/routes';
import { Role } from '@dawwar/types';
import { useSelectRole } from '@dawwar/api-client';
import type { RoleScreenNavProp, RoleOption } from './types';

const ROLE_OPTIONS: RoleOption[] = [
  {
    role: 'CUSTOMER',
    icon: 'shopping-outline',
    titleKey: 'auth.as_customer',
    subtitleKey: 'auth.as_customer_sub',
  },
  {
    role: 'MERCHANT',
    icon: 'store-outline',
    titleKey: 'auth.as_merchant',
    subtitleKey: 'auth.as_merchant_sub',
  },
  {
    role: 'DRIVER',
    icon: 'motorbike',
    titleKey: 'auth.as_driver',
    subtitleKey: 'auth.as_driver_sub',
  },
];

export function useController() {
  const { t } = useTranslation();
  const navigation = useNavigation<RoleScreenNavProp>();
  const dispatch = useAppDispatch();
  const _user = useAppSelector(selectUser);

  const [selectedRole, setSelectedRole] = useState<'CUSTOMER' | 'MERCHANT' | 'DRIVER' | null>(
    null,
  );

  const selectRoleMutation = useSelectRole();

  const handleContinue = useCallback(async () => {
    if (!selectedRole) return;
    try {
      await selectRoleMutation.mutateAsync(selectedRole);
      dispatch(updateUser({ role: selectedRole as Role }));
      if (selectedRole !== 'DRIVER') {
        navigation.navigate(AUTH_ROUTES.PENDING as never);
      }
    } catch {
       // Handled by mutation or interceptor
    }
  }, [selectedRole, selectRoleMutation, dispatch, navigation]);

  return {
    roleOptions: ROLE_OPTIONS,
    selectedRole,
    setSelectedRole,
    handleContinue,
    isLoading: selectRoleMutation.isPending,
    isButtonDisabled: !selectedRole || selectRoleMutation.isPending,
    t,
  };
}
