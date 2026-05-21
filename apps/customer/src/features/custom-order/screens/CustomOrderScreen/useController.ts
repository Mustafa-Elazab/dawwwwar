import { useState, useCallback, useMemo } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from '@dawwar/i18n';
import { usePlaceCustomOrder, useUploadFile, useUploadFiles, useAddresses } from '@dawwar/api-client';
import { launchImageLibrary } from 'react-native-image-picker';
import Toast from 'react-native-toast-message';
import { useAppSelector } from '../../../../store/hooks';
import { selectUser } from '../../../../store/slices/auth.slice';
import { PaymentMethod } from '@dawwar/types';
import { validateCustomOrder, CASH_LIMIT } from '../../utils/validation';
import { ORDER_ROUTES } from '../../../../navigation/routes';

const DELIVERY_FEE = 15;

export function useController() {
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const user = useAppSelector(selectUser);

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

  const [isUploading, setIsUploading] = useState(false);

  const uploadFile = useUploadFile();
  const uploadFiles = useUploadFiles();
  const placeMutation = usePlaceCustomOrder();

  const { data: addressesRes } = useAddresses(user?.id);
  const addresses = addressesRes?.data || [];
  const selectedAddress = useMemo(() => {
    return addresses.find(a => a.isDefault) || addresses[0] || null;
  }, [addresses]);

  const handleVoiceRecorded = useCallback((uri: string, duration: number) => {
    setVoiceUri(uri);
    setVoiceDuration(duration);
  }, []);

  const handleAddPhoto = useCallback(async () => {
    const result = await launchImageLibrary({ mediaType: 'photo', quality: 0.7, selectionLimit: 5 });
    if (result.assets) {
      const uris = result.assets.map(a => a.uri).filter(Boolean) as string[];
      setPhotos(prev => [...prev, ...uris]);
    }
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

  const handleSubmit = useCallback(async () => {
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
    setIsUploading(true);

    try {
      let uploadedVoiceUrl: string | undefined;
      let uploadedPhotoUrls: string[] | undefined;

      // 1. Upload voice note if exists
      if (voiceUri && !voiceUri.startsWith('http')) {
        const formData = new FormData();
        formData.append('file', { uri: voiceUri, name: 'voice.m4a', type: 'audio/m4a' } as any);
        const res = await uploadFile.mutateAsync(formData);
        uploadedVoiceUrl = res.data.url;
      }

      // 2. Upload photos if exist
      const localPhotos = photos.filter(p => !p.startsWith('http'));
      if (localPhotos.length > 0) {
        // We'll upload each photo individually to match the current backend logic
        const urls = await Promise.all(localPhotos.map(async (uri, i) => {
           const fd = new FormData();
           fd.append('file', { uri, name: `photo_${i}.jpg`, type: 'image/jpeg' } as any);
           const r = await uploadFile.mutateAsync(fd);
           return r.data.url;
        }));
        uploadedPhotoUrls = urls;
      }

      // 3. Place order
      const res = await placeMutation.mutateAsync({
        shopName: shopName || undefined,
        shopAddress,
        shopLatitude: shopLat,
        shopLongitude: shopLng,
        itemsDescription: textDescription || undefined,
        itemsVoiceNote: uploadedVoiceUrl,
        itemsImages: uploadedPhotoUrls,
        estimatedBudget: parseFloat(budget),
        deliveryFee: DELIVERY_FEE,
        paymentMethod: paymentMethod as PaymentMethod,
        deliveryAddress: selectedAddress?.address || 'شارع الجمهورية، سنبلاوين',
        deliveryLatitude: selectedAddress?.latitude || 30.872,
        deliveryLongitude: selectedAddress?.longitude || 31.476,
        deliveryPhone: user?.phone ?? '',
      });

      Toast.show({ type: 'success', text1: t('custom_order.success') });
      navigation.navigate(ORDER_ROUTES.TRACKING, { orderId: res.data.id });
    } catch (err) {
      Toast.show({ type: 'error', text1: t('errors.server') });
    } finally {
      setIsUploading(false);
    }
  }, [shopAddress, shopLat, shopLng, shopName, textDescription, voiceUri, photos, budget, paymentMethod, t, user, uploadFile, placeMutation, navigation]);

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
    isBudgetOverLimit: parseFloat(budget) > CASH_LIMIT && paymentMethod === 'CASH',
    isLoading: placeMutation.isPending || isUploading,
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
