import { useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Alert } from 'react-native';
import { useTranslation } from '@dawwar/i18n';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import { logout, selectUser, updateUser } from '../../../../store/slices/auth.slice';
import { resetLocationState } from '../../../../store/slices/location.slice';
import { PROFILE_ROUTES } from '../../../../navigation/routes';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { ProfileStackParamList } from '../../../../navigation/types';
import { launchImageLibrary } from 'react-native-image-picker';
import { useUpdateProfile, useUploadFile } from '@dawwar/api-client';
import Toast from 'react-native-toast-message';
import { socket as socketManager } from '../../../../core/socket/socket';

interface ReactNativeFile {
  uri: string;
  name: string;
  type: string;
}

export function useController() {
  const { t } = useTranslation();
  const navigation = useNavigation<StackNavigationProp<ProfileStackParamList>>();
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);

  const updateProfileMutation = useUpdateProfile();
  const uploadFileMutation = useUploadFile();

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
        const imageUrl = uploadRes.data.url;

        // 2. Update user profile
        const updateRes = await updateProfileMutation.mutateAsync({ avatar: imageUrl });
        dispatch(updateUser({ avatar: updateRes.data.avatar }));

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

  return {
    user,
    navigate: navigation.navigate,
    handleLogout,
    handlePickImage,
    isUploading: uploadFileMutation.isPending || updateProfileMutation.isPending,
    t,
  };
}
