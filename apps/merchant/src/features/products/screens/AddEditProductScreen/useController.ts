import { useState, useCallback } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTranslation } from '@dawwar/i18n';
import { useSaveProduct } from '../../core/hooks';
import { mockCategories } from '@dawwar/mocks';
import { useAppSelector } from '../../../../store/hooks';
import { selectUser } from '../../../../store/slices/auth.slice';
import { mockMerchants } from '@dawwar/mocks';

export function useController() {
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const user = useAppSelector(selectUser);
  const merchant = mockMerchants.find((m) => m.userId === user?.id);

  const [nameAr, setNameAr] = useState('');
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [categoryId, setCategoryId] = useState(mockCategories[0]?.id ?? '');
  const [isAvailable, setIsAvailable] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);
  // Phase 1: placeholder image URL
  const [imageUri] = useState(`https://placehold.co/400x400/FF6B35/white?text=${encodeURIComponent('Product')}`);

  const saveMutation = useSaveProduct();

  const handleSave = useCallback(async () => {
    if (!nameAr.trim() || !price.trim()) return;
    await saveMutation.mutateAsync({
      merchantId: merchant?.id ?? '',
      name: name || nameAr,
      nameAr,
      price: parseFloat(price),
      images: [imageUri],
      categoryId,
      isAvailable,
      isFeatured,
    });
    navigation.goBack();
  }, [nameAr, name, price, categoryId, isAvailable, isFeatured, imageUri, merchant, saveMutation, navigation]);

  const isButtonDisabled = !nameAr.trim() || !price.trim() || isNaN(parseFloat(price)) || saveMutation.isPending;

  return {
    nameAr, setNameAr,
    name, setName,
    price, setPrice,
    categoryId, setCategoryId,
    isAvailable, setIsAvailable,
    isFeatured, setIsFeatured,
    categories: mockCategories,
    handleSave,
    isLoading: saveMutation.isPending,
    isButtonDisabled,
    handleBack: () => navigation.goBack(),
    t,
  };
}
