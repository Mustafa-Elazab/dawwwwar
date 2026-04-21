import React from 'react';
import { View, TouchableOpacity, Alert } from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import FastImage from 'react-native-fast-image';
import { useTheme } from '@dawwar/theme';
import { Text, Icon } from '@dawwar/ui';
import { useTranslation } from '@dawwar/i18n';
import { createStyles } from './styles';
import type { PhotoGridProps } from './types';
import { USE_MOCK_API } from '../../../../core/api/config';
import { api } from '../../../../core/api/client';

export function PhotoGrid({
  photos,
  onAdd,
  onRemove,
  maxPhotos = 5,
}: PhotoGridProps) {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const { t } = useTranslation();

  const uploadPhoto = async (asset: { uri?: string; type?: string; fileName?: string | null }) => {
    if (!asset.uri) return;

    if (USE_MOCK_API) {
      // Phase 1: just store local URI
      onAdd(asset.uri);
      return;
    }

    // Phase 2: get presigned URL and upload directly to S3
    try {
      const { data: { uploadUrl, fileUrl } } = await api.post('/upload/presign', {
        filename: asset.fileName ?? 'photo.jpg',
        mimeType: asset.type ?? 'image/jpeg',
        folder: 'orders',
      });

      // Upload directly to S3 (bypasses our API server for the binary data)
      const formData = new FormData();
      formData.append('file', {
        uri: asset.uri,
        type: asset.type,
        name: asset.fileName ?? 'photo.jpg',
      } as unknown as Blob);

      await fetch(uploadUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': asset.type ?? 'image/jpeg',
        },
        body: formData,
      });

      onAdd(fileUrl);  // permanent S3 URL, not local URI
    } catch (err) {
      console.error('Upload failed:', err);
      // Graceful fallback: use local URI so form isn't blocked
      onAdd(asset.uri);
    }
  };

  const pickPhoto = () => {
    const options = [t('custom_order.take_photo'), t('custom_order.choose_gallery'), t('common.cancel')];
    Alert.alert(t('custom_order.add_photo'), undefined, [
      {
        text: t('custom_order.take_photo'),
        onPress: () => {
          launchCamera(
            { mediaType: 'photo', quality: 0.7, includeBase64: false },
            (res) => {
              if (res.assets?.[0]) {
                void uploadPhoto(res.assets[0]);
              }
            },
          );
        },
      },
      {
        text: t('custom_order.choose_gallery'),
        onPress: () => {
          launchImageLibrary(
            { mediaType: 'photo', quality: 0.7, selectionLimit: maxPhotos - photos.length },
            (res) => {
              if (res.assets?.length) {
                res.assets.forEach((asset) => void uploadPhoto(asset));
              }
            },
          );
        },
      },
      { text: t('common.cancel'), style: 'cancel' },
    ]);
  };

  return (
    <View style={styles.grid}>
      {photos.map((uri, i) => (
        <View key={`photo-${i}`} style={styles.cell}>
          <FastImage source={{ uri }} style={styles.image} resizeMode={FastImage.resizeMode.cover} />
          <TouchableOpacity style={styles.removeBtn} onPress={() => onRemove(i)}>
            <Icon name="close" size={12} color="#fff" />
          </TouchableOpacity>
        </View>
      ))}
      {photos.length < maxPhotos && (
        <TouchableOpacity style={styles.addCell} onPress={pickPhoto}>
          <Icon name="camera-plus-outline" size={24} color={colors.textSecondary} />
          <Text style={styles.addText}>{t('custom_order.photos_count', { count: photos.length })}/{maxPhotos}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
