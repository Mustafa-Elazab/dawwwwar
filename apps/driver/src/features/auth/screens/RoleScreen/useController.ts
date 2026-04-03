import { useState, useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useMutation } from '@tanstack/react-query';
import { useTranslation } from '@dawwar/i18n';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import { updateUser, selectUser } from '../../../../store/slices/auth.slice';
import { AUTH_ROUTES } from '../../navigation/route';
import { Role } from '@dawwar/types';
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

  // Phase 1: mock role selection — just update local Redux state
  const selectRoleMutation = useMutation({
    mutationFn: async (role: 'CUSTOMER' | 'MERCHANT' | 'DRIVER') => {
      // Phase 2: call POST /auth/select-role
      await new Promise((r) => setTimeout(r, 500));
      return { role };
    },
    onSuccess: ({ role }) => {
      dispatch(updateUser({ role: role as Role }));
      if (role !== 'DRIVER') {
        // Customer/Merchant go to pending screen (wrong app for their role)
        navigation.navigate(AUTH_ROUTES.PENDING as any);
      }
      // DRIVER: RootNavigator detects isAuthenticated + role = DRIVER → shows DriverTabs
    },
  });

  const handleContinue = useCallback(() => {
    if (!selectedRole) return;
    selectRoleMutation.mutate(selectedRole);
  }, [selectedRole, selectRoleMutation]);

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
