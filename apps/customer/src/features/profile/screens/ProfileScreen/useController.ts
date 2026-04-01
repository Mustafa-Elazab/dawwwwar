import { useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Alert } from 'react-native';
import { useTranslation } from '@dawwar/i18n';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import { logout, selectUser } from '../../../../store/slices/auth.slice';
import { PROFILE_ROUTES } from '../../../../navigation/routes';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { ProfileStackParamList } from '../../../../navigation/types';

export function useController() {
  const { t } = useTranslation();
  const navigation = useNavigation<StackNavigationProp<ProfileStackParamList>>();
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);

  const handleLogout = useCallback(() => {
    Alert.alert(
      t('profile.logout_confirm_title'),
      t('profile.logout_confirm_body'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('profile.logout_confirm_btn'),
          style: 'destructive',
          onPress: () => {
            dispatch(logout());
          },
        },
      ],
    );
  }, [dispatch, t]);

  return {
    user,
    navigate: navigation.navigate,
    handleLogout,
    t,
  };
}
