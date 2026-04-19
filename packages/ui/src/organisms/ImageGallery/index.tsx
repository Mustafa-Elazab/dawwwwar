import React, { useState, useCallback } from 'react';
import {
  Modal,
  View,
  TouchableOpacity,
  FlatList,
  type ListRenderItem,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import { useTheme } from '@dawwar/theme';
import { Icon } from '../../atoms/Icon/index';
import { createStyles } from './styles';
import type { ImageGalleryProps } from './types';

export function ImageGallery({
  images,
  initialIndex = 0,
  onClose,
  testID,
}: ImageGalleryProps) {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  const renderImage: ListRenderItem<string> = useCallback(
    ({ item }) => (
      <FastImage
        source={{ uri: item }}
        style={styles.image}
        resizeMode={FastImage.resizeMode.contain}
      />
    ),
    [styles.image],
  );

  return (
    <Modal
      visible
      transparent={false}
      animationType="fade"
      statusBarTranslucent
      testID={testID}
    >
      <View style={styles.overlay}>
        {/* Close button */}
        <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
          <Icon name="close" size={22} color="#fff" />
        </TouchableOpacity>

        {/* Main image list */}
        <FlatList<string>
          data={images}
          renderItem={renderImage}
          keyExtractor={(_, i) => String(i)}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          initialScrollIndex={initialIndex}
          getItemLayout={(_, index) => ({
            length: styles.image.width as number,
            offset: (styles.image.width as number) * index,
            index,
          })}
          onMomentumScrollEnd={(e) => {
            const idx = Math.round(
              e.nativeEvent.contentOffset.x / (styles.image.width as number),
            );
            setCurrentIndex(idx);
          }}
        />

        {/* Dot indicators */}
        {images.length > 1 && (
          <View style={styles.dotRow}>
            {images.map((_, i) => (
              <View
                key={i}
                style={[styles.dot, i === currentIndex && styles.dotActive]}
              />
            ))}
          </View>
        )}
      </View>
    </Modal>
  );
}
