import { useState, useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from '@dawwar/i18n';
import { useAppSelector } from '../../../../store/hooks';
import { selectUser } from '../../../../store/slices/auth.slice';
import { profileApi } from '../../core/api';
import Toast from 'react-native-toast-message';

export function useController() {
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const user = useAppSelector(selectUser);
  const queryClient = useQueryClient();

  const [label, setLabel] = useState('Home');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState(user?.phone ?? '');
  const [notes, setNotes] = useState('');
  const [isDefault, setIsDefault] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [lat, setLat] = useState(30.8704);
  const [lng, setLng] = useState(31.4741);

  const saveMutation = useMutation({
    mutationFn: () =>
      profileApi.saveAddress({
        userId: user?.id ?? '',
        label,
        address,
        latitude: lat,
        longitude: lng,
        phone,
        notes: notes || undefined,
        isDefault,
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['addresses', user?.id] });
      Toast.show({ type: 'success', text1: t('addresses.saved') });
      navigation.goBack();
    },
    onError: () => Toast.show({ type: 'error', text1: t('errors.server') }),
  });

  return {
    label, setLabel,
    address, setAddress,
    phone, setPhone,
    notes, setNotes,
    isDefault, setIsDefault,
    showMap, setShowMap,
    handleMapConfirm: (latitude: number, longitude: number, addr: string) => {
      setLat(latitude); setLng(longitude); setAddress(addr); setShowMap(false);
    },
    handleSave: () => saveMutation.mutate(),
    isLoading: saveMutation.isPending,
    isButtonDisabled: !address.trim() || saveMutation.isPending,
    handleBack: () => navigation.goBack(),
    t,
  };
}
