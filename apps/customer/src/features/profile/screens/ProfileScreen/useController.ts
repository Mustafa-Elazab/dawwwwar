import { useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Alert } from 'react-native';
import { useTranslation } from '@dawwar/i18n';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import { logout, selectUser, startAuthFlow, updateUser } from '../../../../store/slices/auth.slice';
import { resetLocationState } from '../../../../store/slices/location.slice';
import { PROFILE_ROUTES } from '../../../../navigation/routes';
import {
  selectPushNotifications,
  selectThemeMode,
  setPushNotifications,
  setThemeMode,
} from '../../../../store/slices/ui.slice';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { ProfileStackParamList } from '../../../../navigation/types';
import { launchImageLibrary } from 'react-native-image-picker';
import { useUpdateProfile, useUploadFile, useWallet } from '@dawwar/api-client';
import Toast from 'react-native-toast-message';
import { socket as socketManager } from '../../../../core/socket/socket';
import { requestPushNotificationPermission } from '../../../../utils/notifications';
import { ThemeMode, type Wallet } from '@dawwar/types';
import { useTheme } from '@dawwar/theme';

interface ReactNativeFile {
  uri: string;
  name: string;
  type: string;
}

const unwrap = <T,>(res: T | { data: T }): T =>
  res && typeof res === 'object' && 'data' in res ? res.data : (res as T);

export function useController() {
  const { t } = useTranslation();
  const navigation = useNavigation<StackNavigationProp<ProfileStackParamList>>();
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const pushNotifications = useAppSelector(selectPushNotifications);
  const themeMode = useAppSelector(selectThemeMode);
  const { setMode } = useTheme();

  const updateProfileMutation = useUpdateProfile();
  const uploadFileMutation = useUploadFile();
  const walletQuery = useWallet({ enabled: !!user });
  const wallet = walletQuery.data ? unwrap<Wallet>(walletQuery.data) : undefined;
  const walletBalance = Number(wallet?.balance ?? 0);

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
            socketManager.disconnect();
            dispatch(logout());
            dispatch(resetLocationState());
          },
        },
      ],
    );
  }, [dispatch, t]);

  const handlePickImage = useCallback(async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      quality: 0.8,
    });

    if (result.assets && result.assets.length > 0) {
      const asset = result.assets[0];
      const formData = new FormData();
      
      const file: ReactNativeFile = {
        uri: asset.uri!,
        name: asset.fileName ?? 'profile.jpg',
        type: asset.type ?? 'image/jpeg',
      };
      
      formData.append('file', file as unknown as Blob);

      try {
        // 1. Upload file
        const uploadRes = await uploadFileMutation.mutateAsync(formData);
        const imageUrl = unwrap<{ url: string }>(uploadRes).url;

        // 2. Update user profile
        const updateRes = await updateProfileMutation.mutateAsync({ avatar: imageUrl });
        dispatch(updateUser({ avatar: unwrap<{ avatar?: string }>(updateRes).avatar }));

        Toast.show({
          type: 'success',
          text1: t('auth.profile_updated'),
        });
      } catch (err) {
        Toast.show({
          type: 'error',
          text1: t('errors.server'),
        });
      }
    }
  }, [dispatch, t, updateProfileMutation, uploadFileMutation]);

  const handleTogglePushNotifications = useCallback(async (enabled: boolean) => {
    if (!enabled) {
      dispatch(setPushNotifications(false));
      return;
    }

    const granted = await requestPushNotificationPermission();
    dispatch(setPushNotifications(granted));
    if (!granted) {
      Toast.show({ type: 'error', text1: t('errors.notification_permission', 'Notification permission was not granted') });
    }
  }, [dispatch, t]);

  const handleToggleDarkMode = useCallback((enabled: boolean) => {
    const nextMode = enabled ? ThemeMode.DARK : ThemeMode.LIGHT;
    dispatch(setThemeMode(nextMode));
    setMode(nextMode);
  }, [dispatch, setMode]);

  return {
    user,
    walletBalance,
    walletBalanceLabel: `${walletBalance.toFixed(2)} ${t('common.egp')}`,
    navigate: navigation.navigate,
    handleLogin: () => dispatch(startAuthFlow()),
    handleLogout,
    handlePickImage,
    pushNotifications,
    isDarkMode: themeMode === ThemeMode.DARK,
    handleTogglePushNotifications,
    handleToggleDarkMode,
    isUploading: uploadFileMutation.isPending || updateProfileMutation.isPending,
    t,
  };
}
