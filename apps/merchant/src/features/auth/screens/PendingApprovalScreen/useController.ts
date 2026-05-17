import { useCallback } from 'react';
import { Linking } from 'react-native';
import { useTranslation } from '@dawwar/i18n';
import { useAppDispatch } from '../../../../store/hooks';
import { logout, setUser } from '../../../../store/slices/auth.slice';
import { useGetMe } from '@dawwar/api-client';
import Toast from 'react-native-toast-message';

const ADMIN_WHATSAPP = 'https://wa.me/201000000000';

export function useController() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { refetch, isFetching } = useGetMe();

  const handleContactAdmin = useCallback(() => {
    void Linking.openURL(ADMIN_WHATSAPP);
  }, []);

  const handleRefreshStatus = useCallback(async () => {
    try {
      const { data: res } = await refetch();
      if (res?.data) {
        dispatch(setUser({ user: res.data, hasStore: true }));
        if (res.data.isApproved) {
          Toast.show({ type: 'success', text1: t('auth.approved_success') });
        } else {
          Toast.show({ type: 'info', text1: t('auth.still_pending') });
        }
      }
    } catch {
      Toast.show({ type: 'error', text1: t('errors.server') });
    }
  }, [refetch, dispatch, t]);

  const handleLogout = useCallback(() => {
    dispatch(logout());
  }, [dispatch]);

  return { 
    handleContactAdmin, 
    handleLogout, 
    handleRefreshStatus,
    isRefreshing: isFetching,
    t 
  };
}
