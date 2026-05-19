import { useState, useCallback } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useUpdateProfile } from '@dawwar/api-client';
import { useTranslation } from '@dawwar/i18n';
import { useAppDispatch } from '../../../../store/hooks';
import { updateUser } from '../../../../store/slices/auth.slice';
import Toast from 'react-native-toast-message';

export function useController() {
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
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
        dispatch(updateUser({ name: res.name }));
        Toast.show({
          type: 'success',
          text1: t('auth.profile_updated'),
        });

        if (returnTo) {
          navigation.reset({
            index: 1,
            routes: [
              { name: 'CustomerTabs' },
              { name: returnTo },
            ],
          });
        } else {
          navigation.reset({ index: 0, routes: [{ name: 'CustomerTabs' }] });
        }
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
