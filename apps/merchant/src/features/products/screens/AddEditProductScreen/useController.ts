import { useState, useCallback } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { launchImageLibrary } from 'react-native-image-picker';
import { useTranslation } from '@dawwar/i18n';
import { useSaveProduct } from '../../core/hooks';
import { useUploadFile, useCategories } from '@dawwar/api-client';
import Toast from 'react-native-toast-message';

export function useController() {
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const productId = route.params?.productId;

  const { data: categoriesRes } = useCategories();
  const categories = categoriesRes?.data || [];

  const [nameAr, setNameAr] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [isAvailable, setIsAvailable] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);
  const [imageUri, setImageUri] = useState(
    `https://placehold.co/400x400/FF6B35/white?text=${encodeURIComponent('Product')}`,
  );
  const [isUploading, setIsUploading] = useState(false);

  const uploadMutation = useUploadFile();

  const handlePickImage = useCallback(() => {
    launchImageLibrary({ mediaType: 'photo', quality: 0.8 }, async (res) => {
      if (res.assets?.[0]?.uri) {
        const uri = res.assets[0].uri;
        setIsUploading(true);
        try {
          const formData = new FormData();
          formData.append('file', { 
            uri, 
            name: 'product.jpg', 
            type: 'image/jpeg' 
          } as any);
          formData.append('folder', 'products');
          
          const uploadRes = await uploadMutation.mutateAsync(formData);
          setImageUri(uploadRes.data.url);
        } catch {
          Toast.show({ type: 'error', text1: t('errors.upload_failed') });
        } finally {
          setIsUploading(false);
        }
      }
    });
  }, [uploadMutation, t]);

  const saveMutation = useSaveProduct();

  const handleSave = useCallback(async () => {
    if (!nameAr.trim() || !price.trim()) return;
    try {
      await saveMutation.mutateAsync({
        name: name || nameAr,
        nameAr,
        price: parseFloat(price),
        images: [imageUri],
        categoryId,
        isAvailable,
        isFeatured,
      });
      navigation.goBack();
    } catch {
      Toast.show({ type: 'error', text1: t('errors.server') });
    }
  }, [nameAr, name, price, categoryId, isAvailable, isFeatured, imageUri, saveMutation, navigation, t]);

  const isButtonDisabled = !nameAr.trim() || !price.trim() || isNaN(parseFloat(price)) || saveMutation.isPending || isUploading;

  return {
    productId,
    nameAr, setNameAr,
    name, setName,
    description, setDescription,
    price, setPrice,
    categoryId, setCategoryId,
    isAvailable, setIsAvailable,
    isFeatured, setIsFeatured,
    categories,
    handleSave,
    isLoading: saveMutation.isPending || isUploading,
    isButtonDisabled,
    handleBack: () => navigation.goBack(),
    imageUri,
    handlePickImage,
    t,
  };
}
