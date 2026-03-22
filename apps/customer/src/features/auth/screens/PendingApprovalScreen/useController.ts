import { useCallback } from 'react';
import { Linking } from 'react-native';
import { useTranslation } from '@dawwar/i18n';
import { useAppDispatch } from '../../../../store/hooks';
import { logout } from '../../../../store/slices/auth.slice';

const ADMIN_WHATSAPP = 'https://wa.me/201000000000';

export function useController() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const handleContactAdmin = useCallback(() => {
    void Linking.openURL(ADMIN_WHATSAPP);
  }, []);

  const handleLogout = useCallback(() => {
    dispatch(logout());
    // RootNavigator auth guard re-renders to AuthNavigator automatically
  }, [dispatch]);

  return { handleContactAdmin, handleLogout, t };
}
