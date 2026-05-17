import { useState, useCallback } from 'react';
import { useUpdateProfile } from '@dawwar/api-client';
import { useTranslation } from '@dawwar/i18n';
import { useAppDispatch } from '../../../../store/hooks';
import { updateUser } from '../../../../store/slices/auth.slice';
import Toast from 'react-native-toast-message';

export function useController() {
  const { t } = useTranslation();
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
      },
      onError: () => {
        setNameError(t('errors.server'));
      },
    });
  }, [name, saveMutation, t, dispatch]);

  return {
    name,
    setName,
    nameError,
    isLoading: saveMutation.isPending,
    handleSave,
  };
}
