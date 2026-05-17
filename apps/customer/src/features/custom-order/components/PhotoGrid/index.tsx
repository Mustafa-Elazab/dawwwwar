import React, { useMemo } from 'react';
import { View, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useTheme } from '@dawwar/theme';
import { Icon, Text } from '@dawwar/ui';
import { createStyles } from './styles';
import type { PhotoGridProps } from './types';

const MAX_PHOTOS = 5;

export function PhotoGrid({ photos, onAdd, onRemove }: PhotoGridProps) {
  const { colors } = useTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.container}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Add photo tile */}
        {photos.length < MAX_PHOTOS && (
          <TouchableOpacity style={styles.addBtn} onPress={() => onAdd()} activeOpacity={0.7}>
            <Icon name="camera-plus-outline" size={28} color={colors.textDisabled} />
            <Text style={styles.count}>{`${photos.length}/${MAX_PHOTOS}`}</Text>
          </TouchableOpacity>
        )}

        {/* Thumbnails */}
        {photos.map((photo, index) => (
          <View key={index} style={styles.photoWrapper}>
            <Image source={{ uri: photo }} style={styles.image} />
            <TouchableOpacity
              style={styles.removeBtn}
              onPress={() => onRemove(index)}
              activeOpacity={0.8}
            >
              <Icon name="close-circle" size={24} color={colors.error} />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
