import { useState, useCallback, useEffect } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useSaveAddress, QUERY_KEYS, AuthService, useApiClient } from '@dawwar/api-client';
import { useTranslation } from '@dawwar/i18n';
import { useAppSelector } from '../../../../store/hooks';
import { selectUser } from '../../../../store/slices/auth.slice';
import Toast from 'react-native-toast-message';
import type { RouteProp } from '@react-navigation/native';
import type { ProfileStackParamList } from '../../../../navigation/types';
import { PROFILE_ROUTES } from '../../../../navigation/routes';

export function useController() {
  const { t } = useTranslation();
  const { profile } = useApiClient();
  const navigation = useNavigation<any>();
  const route = useRoute<RouteProp<ProfileStackParamList, 'AddAddressScreen'>>();
  const { editId } = (route.params as any) ?? {};
  
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

  // Fetch address if editing
  const { data: addressesRes, isLoading: isFetching } = useQuery({
    queryKey: QUERY_KEYS.profile.addresses(user?.id ?? ''),
    queryFn: () => profile.getAddresses(user?.id ?? ''),
    enabled: !!editId && !!user?.id,
  });

  const existingAddress = addressesRes?.data.find((a) => a.id === editId);

  useEffect(() => {
    if (existingAddress) {
      setLabel(existingAddress.label);
      setAddress(existingAddress.address);
      setPhone(existingAddress.phone);
      setNotes(existingAddress.notes ?? '');
      setIsDefault(existingAddress.isDefault);
      setLat(Number(existingAddress.latitude) || 30.8704);
      setLng(Number(existingAddress.longitude) || 31.4741);
    }
  }, [existingAddress]);

  const saveMutation = useSaveAddress();

  const handleSave = () => {
    const payload = {
      userId: user?.id ?? '',
      label,
      address,
      latitude: Number(lat) || 30.8704,
      longitude: Number(lng) || 31.4741,
      phone,
      notes: notes || undefined,
      isDefault,
      id: editId,
    };

    saveMutation.mutate(payload, {
      onSuccess: () => {
        void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.profile.addresses(user?.id ?? '') });
        Toast.show({ 
          type: 'success', 
          text1: editId ? t('addresses.updated') : t('addresses.saved') 
        });
        navigation.goBack();
      },
      onError: () => Toast.show({ type: 'error', text1: t('errors.server') }),
    });
  };

  return {
    label, setLabel,
    address, setAddress,
    phone, setPhone,
    notes, setNotes,
    isDefault, setIsDefault,
    showMap, setShowMap,
    lat, lng,
    handleMapConfirm: (latitude: number, longitude: number, addr: string) => {
      setLat(latitude); setLng(longitude); setAddress(addr); setShowMap(false);
    },
    handleSave,
    isLoading: saveMutation.isPending || isFetching,
    isButtonDisabled: !address.trim() || saveMutation.isPending || isFetching,
    handleBack: () => navigation.goBack(),
    editId,
    t,
  };
}
