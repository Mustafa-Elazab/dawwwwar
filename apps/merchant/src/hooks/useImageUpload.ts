import { useCallback, useState } from 'react';
import { launchImageLibrary } from 'react-native-image-picker';
import { useTranslation } from '@dawwar/i18n';
import { useUploadFile } from '@dawwar/api-client';
import Toast from 'react-native-toast-message';

export const useImageUpload = () => {
  const { t } = useTranslation();
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadMutation = useUploadFile();

  const pickAndUpload = useCallback(async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      quality: 0.8,
      maxWidth: 1024,
      maxHeight: 1024,
    });

    if (result.didCancel || !result.assets?.[0]) return null;

    const asset = result.assets[0];
    if (!asset.uri) return null;

    setIsUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', {
        uri: asset.uri,
        name: asset.fileName ?? `upload_${Date.now()}.jpg`,
        type: asset.type ?? 'image/jpeg',
      } as any);
      formData.append('folder', 'products');

      const res = await uploadMutation.mutateAsync(formData);
      setImageUri(res.data.url);
      return res.data.url;
    } catch (e) {
      setError('Upload failed');
      Toast.show({ type: 'error', text1: t('errors.upload_failed') });
      return null;
    } finally {
      setIsUploading(false);
    }
  }, [uploadMutation, t]);

  return { imageUri, isUploading, error, pickAndUpload, setImageUri };
};
