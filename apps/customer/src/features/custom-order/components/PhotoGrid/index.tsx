import React from 'react';
import { View, TouchableOpacity, Alert } from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import FastImage from 'react-native-fast-image';
import { useTheme } from '@dawwar/theme';
import { Text, Icon } from '@dawwar/ui';
import { useTranslation } from '@dawwar/i18n';
import { createStyles } from './styles';
import type { PhotoGridProps } from './types';

export function PhotoGrid({
  photos,
  onAdd,
  onRemove,
  maxPhotos = 5,
}: PhotoGridProps) {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const { t } = useTranslation();

  const pickPhoto = () => {
    const options = [t('custom_order.take_photo'), t('custom_order.choose_gallery'), t('common.cancel')];
    Alert.alert(t('custom_order.add_photo'), undefined, [
      {
        text: t('custom_order.take_photo'),
        onPress: () => {
          launchCamera(
            { mediaType: 'photo', quality: 0.7, includeBase64: false },
            (res) => {
              if (res.assets?.[0]?.uri) {
                onAdd();
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
                res.assets.forEach(() => onAdd());
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
