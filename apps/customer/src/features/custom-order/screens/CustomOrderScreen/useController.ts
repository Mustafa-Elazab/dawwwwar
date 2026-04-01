import { useState, useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useMutation } from '@tanstack/react-query';
import { useTranslation } from '@dawwar/i18n';
import Toast from 'react-native-toast-message';
import { useAppSelector } from '../../../../store/hooks';
import { selectUser } from '../../../../store/slices/auth.slice';
import { customOrderApi } from '../../core/api';
import { PaymentMethod } from '@dawwar/types';
import { validateCustomOrder, CASH_LIMIT } from '../../utils/validation';
import { ORDER_ROUTES } from '../../../../navigation/routes';

const DELIVERY_FEE = 15;

export function useController() {
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const user = useAppSelector(selectUser);

  // Form state
  const [shopName, setShopName] = useState('');
  const [shopAddress, setShopAddress] = useState('');
  const [shopLat, setShopLat] = useState(30.8704);
  const [shopLng, setShopLng] = useState(31.4741);
  const [textDescription, setTextDescription] = useState('');
  const [voiceUri, setVoiceUri] = useState<string | null>(null);
  const [voiceDuration, setVoiceDuration] = useState(0);
  const [photos, setPhotos] = useState<string[]>([]);
  const [budget, setBudget] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'CASH' | 'WALLET'>('CASH');
  const [showMapPicker, setShowMapPicker] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isBudgetOverLimit =
    parseFloat(budget) > CASH_LIMIT && paymentMethod === 'CASH';

  const handleVoiceRecorded = useCallback((uri: string, duration: number) => {
    setVoiceUri(uri);
    setVoiceDuration(duration);
  }, []);

  const handleAddPhoto = useCallback(() => {
    // Phase 1: add placeholder URI
    setPhotos((prev) => [...prev, `https://placehold.co/400x400/FF6B35/white?text=Photo+${prev.length + 1}`]);
  }, []);

  const handleRemovePhoto = useCallback((index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleMapConfirm = useCallback((lat: number, lng: number, address: string) => {
    setShopLat(lat);
    setShopLng(lng);
    setShopAddress(address);
    setShowMapPicker(false);
  }, []);

  const placeMutation = useMutation({
    mutationFn: () =>
      customOrderApi.place({
        customerId: user?.id ?? '',
        shopName: shopName || undefined,
        shopAddress,
        shopLatitude: shopLat,
        shopLongitude: shopLng,
        itemsDescription: textDescription || undefined,
        estimatedBudget: parseFloat(budget),
        deliveryFee: DELIVERY_FEE,
        paymentMethod: paymentMethod as PaymentMethod,
        deliveryAddress: 'شارع الجمهورية، سنبلاوين',
        deliveryLatitude: 30.872,
        deliveryLongitude: 31.476,
        deliveryPhone: user?.phone ?? '',
      }),
    onSuccess: (res) => {
      Toast.show({ type: 'success', text1: t('custom_order.success') });
      navigation.navigate(ORDER_ROUTES.TRACKING, { orderId: res.data.id });
    },
    onError: () => {
      Toast.show({ type: 'error', text1: t('errors.server') });
    },
  });

  const handleSubmit = useCallback(() => {
    const draft = {
      shopAddress, shopLatitude: shopLat, shopLongitude: shopLng, shopName,
      textDescription, voiceUri, photos, estimatedBudget: budget, paymentMethod,
    };
    const validationErrors = validateCustomOrder(draft, t);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors as Record<string, string>);
      return;
    }
    setErrors({});
    placeMutation.mutate();
  }, [shopAddress, shopLat, shopLng, shopName, textDescription, voiceUri, photos, budget, paymentMethod, t, placeMutation]);

  return {
    shopName, setShopName,
    shopAddress, setShopAddress,
    textDescription, setTextDescription,
    voiceUri,
    voiceDuration,
    photos,
    budget, setBudget,
    paymentMethod, setPaymentMethod,
    showMapPicker, setShowMapPicker,
    errors,
    isBudgetOverLimit,
    isLoading: placeMutation.isPending,
    handleVoiceRecorded,
    handleVoiceClear: () => setVoiceUri(null),
    handleAddPhoto,
    handleRemovePhoto,
    handleMapConfirm,
    handleSubmit,
    handleBack: () => navigation.goBack(),
    t,
  };
}
