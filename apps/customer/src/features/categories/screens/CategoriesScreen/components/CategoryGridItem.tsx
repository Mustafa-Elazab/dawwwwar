import React from 'react';
import { View } from 'react-native';
import { CategoryCard } from '../../../components/CategoryCard';
import { styles } from '../styles';
import type { Category } from '@dawwar/types';

interface CategoryGridItemProps {
  category: Category;
  displayName: string;
  onPress: (categoryId: string, categoryName: string) => void;
}

export function CategoryGridItem({
  category,
  displayName,
  onPress,
}: CategoryGridItemProps) {
  if (category.id.startsWith('__empty_')) {
    return <View style={styles.spacer} />;
  }

  return (
    <CategoryCard
      category={category}
      onPress={() => onPress(category.id, displayName)}
    />
  );
}
