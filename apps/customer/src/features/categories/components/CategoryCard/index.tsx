import React from 'react';
import { View } from 'react-native';
import { useTheme, microInteractions } from '@dawwar/theme';
import { useTranslation } from '@dawwar/i18n';
import { Text, AnimatedPressable } from '@dawwar/ui';
import { createStyles } from './styles';
import type { CategoryCardProps } from './types';

const PASTEL_PALETTE = [
  { bg: '#E8F5E9', border: '#C8E6C9' }, // Green
  { bg: '#FFF3E0', border: '#FFE0B2' }, // Orange
  { bg: '#E3F2FD', border: '#BBDEFB' }, // Blue
  { bg: '#FCE4EC', border: '#F8BBD0' }, // Pink
  { bg: '#F3E5F5', border: '#E1BEE7' }, // Purple
  { bg: '#FFFDE7', border: '#FFF9C4' }, // Yellow
  { bg: '#E0F2F1', border: '#B2DFDB' }, // Teal
  { bg: '#EFEBE9', border: '#D7CCC8' }, // Brown
];

export const CategoryCard = React.memo(function CategoryCard({
  category,
  merchantCount,
  onPress,
}: CategoryCardProps) {
  const { colors } = useTheme();
  const { i18n } = useTranslation();
  const styles = React.useMemo(() => createStyles(colors), [colors]);

  const displayName = i18n.language.startsWith('ar')
    ? category.nameAr || category.name
    : category.name || category.nameAr;

  // Use a rotating palette based on the category ID (or just hash it)
  const colorIndex = parseInt(category.id.replace(/\D/g, '') || '0', 10) % PASTEL_PALETTE.length;
  const tints = PASTEL_PALETTE[colorIndex] || PASTEL_PALETTE[0];

  return (
    <AnimatedPressable
      style={[styles.card, { backgroundColor: tints.bg, borderColor: tints.border }]}
      onPress={onPress}
      pressScale={microInteractions.cardPressScale}
      pressOpacity={microInteractions.pressOpacity}
      pressTranslateY={1}
    >
      <View style={styles.iconCircle}>
        <Text style={styles.emoji}>{category.icon}</Text>
      </View>
      <Text style={styles.name} numberOfLines={1}>
        {displayName}
      </Text>
    </AnimatedPressable>
  );
});
