import { useCallback } from 'react';
import { Alert } from 'react-native';
import { useTranslation } from '@dawwar/i18n';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import { logout, selectUser } from '../../../../store/slices/auth.slice';
import { useDriverWalletBalance } from '../../../earnings/core/hooks';
import { setAppLanguage } from '@dawwar/i18n';
import { storage } from '../../../../core/storage/mmkv';
import { Language } from '@dawwar/types';
import RNRestart from 'react-native-restart';
import { useTheme } from '@dawwar/theme';
import { ThemeMode } from '@dawwar/types';
import { useAppSelector as useSelector } from '../../../../store/hooks';
import { setThemeMode, selectThemeMode, setLanguage, selectLanguage } from '../../../../store/slices/ui.slice';

export function useController() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const { setMode } = useTheme();
  const currentMode = useSelector(selectThemeMode);
  const currentLanguage = useSelector(selectLanguage);
  const { data: balance } = useDriverWalletBalance();

  const handleLogout = useCallback(() => {
    Alert.alert(
      t('profile.logout_confirm_title'),
      t('profile.logout_confirm_body'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('profile.logout_confirm_btn'),
          style: 'destructive',
          onPress: () => dispatch(logout()),
        },
      ],
    );
  }, [dispatch, t]);

  const handleToggleLanguage = useCallback(() => {
    const next = currentLanguage === Language.AR ? Language.EN : Language.AR;
    Alert.alert(t('language.restart_title'), t('language.restart_body'), [
      { text: t('language.restart_later'), style: 'cancel' },
      {
        text: t('language.restart_now'),
        onPress: async () => {
          dispatch(setLanguage(next));
          await setAppLanguage(next, storage, () => RNRestart.restart());
        },
      },
    ]);
  }, [currentLanguage, dispatch, t]);

  const handleToggleTheme = useCallback(() => {
    const next = currentMode === ThemeMode.DARK ? ThemeMode.LIGHT : ThemeMode.DARK;
    dispatch(setThemeMode(next));
    setMode(next);
  }, [currentMode, dispatch, setMode]);

  return {
    user,
    balance: balance ?? 0,
    currentMode,
    currentLanguage,
    handleLogout,
    handleToggleLanguage,
    handleToggleTheme,
    t,
  };
}
