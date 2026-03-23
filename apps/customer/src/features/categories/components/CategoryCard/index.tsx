import React from 'react';
import { TouchableOpacity } from 'react-native';
import { useTheme } from '@dawwar/theme';
import { Text } from '@dawwar/ui';
import { createStyles } from './styles';
import type { CategoryCardProps } from './types';

export function CategoryCard({ category, merchantCount, onPress }: CategoryCardProps) {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      <Text style={styles.emoji}>{category.icon}</Text>
      <Text style={styles.name}>{category.nameAr}</Text>
      {merchantCount !== undefined && (
        <Text style={styles.count}>{merchantCount}</Text>
      )}
    </TouchableOpacity>
  );
}
