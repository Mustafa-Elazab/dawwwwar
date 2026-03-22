import React from 'react';
import { View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { useTheme } from '@dawwar/theme';
import { Text } from '../Text';
import { createStyles } from './styles';
import type { AvatarProps } from './types';

const getInitials = (name?: string): string => {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return (parts[0]?.[0] ?? '?').toUpperCase();
  return ((parts[0]?.[0] ?? '') + (parts[1]?.[0] ?? '')).toUpperCase();
};

export function Avatar({ uri, name, size = 'md', testID }: AvatarProps) {
  const { colors } = useTheme();
  const styles = createStyles(colors, size);

  return (
    <View style={styles.container} testID={testID}>
      {uri ? (
        <FastImage
          style={styles.image}
          source={{ uri, priority: FastImage.priority.normal }}
          resizeMode={FastImage.resizeMode.cover}
        />
      ) : (
        <Text style={styles.initials}>{getInitials(name)}</Text>
      )}
    </View>
  );
}
