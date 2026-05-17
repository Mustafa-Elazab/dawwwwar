import { useState, useCallback, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from '@dawwar/i18n';
import { useCreateMerchant, useCategories } from '@dawwar/api-client';
import Toast from 'react-native-toast-message';
import { useAppDispatch } from '../../../../store/hooks';
import { setHasStore } from '../../../../store/slices/auth.slice';

export function useController() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigation = useNavigation();
  const createMerchantMutation = useCreateMerchant();

  const [businessName, setBusinessName] = useState('');
  const [parentCategoryId, setParentCategoryId] = useState('');
  const [childCategoryIds, setChildCategoryIds] = useState<string[]>([]);
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [governorate, setGovernorate] = useState('');
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);

  const handleChildToggle = useCallback((id: string) => {
    setChildCategoryIds(prev => 
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  }, []);

  const handleParentSelect = useCallback((id: string) => {
    if (id !== parentCategoryId) {
      setParentCategoryId(id);
      setChildCategoryIds([]); // Reset children when parent changes
    }
  }, [parentCategoryId]);

  const handleCreateStore = useCallback(async () => {
    if (!businessName || !parentCategoryId || !latitude || !longitude || !address) {
      Toast.show({ type: 'error', text1: t('common.error'), text2: t('auth.fill_all_fields') });
      return;
    }

    try {
      await createMerchantMutation.mutateAsync({
        businessName,
        parentCategoryId,
        categoryIds: childCategoryIds,
        address,
        city,
        governorate,
        latitude,
        longitude,
      } as any);
      dispatch(setHasStore(true));
    } catch (err) {
      Toast.show({ type: 'error', text1: t('errors.server') });
    }
  }, [businessName, parentCategoryId, childCategoryIds, latitude, longitude, address, createMerchantMutation, t, dispatch]);

  const isButtonDisabled = !businessName || !parentCategoryId || !latitude || !longitude || createMerchantMutation.isPending;

  return {
    businessName, setBusinessName,
    parentCategoryId, handleParentSelect,
    childCategoryIds, handleChildToggle,
    address, setAddress,
    city, setCity,
    governorate, setGovernorate,
    setLatitude, setLongitude,
    handleCreateStore,
    isLoading: createMerchantMutation.isPending,
    isButtonDisabled,
    t,
  };
}
