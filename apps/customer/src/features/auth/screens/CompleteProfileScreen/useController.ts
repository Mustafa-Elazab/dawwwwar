import { useState, useCallback } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useUpdateProfile } from '@dawwar/api-client';
import { useTranslation } from '@dawwar/i18n';
import { useAppDispatch } from '../../../../store/hooks';
import { updateUser } from '../../../../store/slices/auth.slice';
import Toast from 'react-native-toast-message';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RouteProp } from '@react-navigation/native';
import type { AuthStackParamList, RootParamList } from '../../../../navigation/types';
import { AUTH_ROUTES, MODAL_ROUTES, PROFILE_ROUTES, TAB_ROUTES, WALLET_ROUTES } from '../../../../navigation/routes';

export function useController() {
  const { t } = useTranslation();
  const navigation = useNavigation<StackNavigationProp<AuthStackParamList, typeof AUTH_ROUTES.COMPLETE_PROFILE>>();
  const route = useRoute<RouteProp<AuthStackParamList, typeof AUTH_ROUTES.COMPLETE_PROFILE>>();
  const returnTo = route.params?.returnTo;
  const dispatch = useAppDispatch();
  const [name, setName] = useState('');
  const [nameError, setNameError] = useState<string | null>(null);

  const saveMutation = useUpdateProfile();

  const handleSave = useCallback(() => {
    if (!name.trim()) {
      setNameError(t('auth.name_required'));
      return;
    }
    setNameError(null);
    saveMutation.mutate({ name }, {
      onSuccess: (res) => {
        // Update local state
        dispatch(updateUser({ name: res.data.name }));
        Toast.show({
          type: 'success',
          text1: t('auth.profile_updated'),
        });

        const rootNavigation = navigation.getParent<StackNavigationProp<RootParamList>>();

        if (returnTo) {
          if (returnTo === 'checkout') {
            rootNavigation?.reset({
              index: 1,
              routes: [{ name: 'CustomerTabs' }, { name: MODAL_ROUTES.CHECKOUT }],
            });
            return;
          }

          if (returnTo === 'orders') {
            rootNavigation?.reset({
              index: 0,
              routes: [{ name: 'CustomerTabs', params: { screen: TAB_ROUTES.ORDERS_TAB } }],
            });
            return;
          }

          if (returnTo === 'wallet') {
            rootNavigation?.reset({
              index: 0,
              routes: [{
                name: 'CustomerTabs',
                params: {
                  screen: TAB_ROUTES.PROFILE_TAB,
                  params: { screen: WALLET_ROUTES.WALLET },
                },
              }],
            });
            return;
          }

          if (returnTo === 'address') {
            rootNavigation?.reset({
              index: 0,
              routes: [{
                name: 'CustomerTabs',
                params: {
                  screen: TAB_ROUTES.PROFILE_TAB,
                  params: { screen: PROFILE_ROUTES.ADDRESSES },
                },
              }],
            });
            return;
          }
        } else {
          rootNavigation?.reset({ index: 0, routes: [{ name: 'CustomerTabs' }] });
        }

        rootNavigation?.reset({ index: 0, routes: [{ name: 'CustomerTabs' }] });
      },
      onError: () => {
        setNameError(t('errors.server'));
      },
    });
  }, [name, saveMutation, t, dispatch, returnTo, navigation]);

  return {
    name,
    setName,
    nameError,
    isLoading: saveMutation.isPending,
    handleSave,
  };
}
