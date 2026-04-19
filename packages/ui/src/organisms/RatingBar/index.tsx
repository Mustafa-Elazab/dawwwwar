import React, { useCallback } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { useTheme } from '@dawwar/theme';
import { Text } from '../../atoms/Text/index';
import { createStyles } from './styles';
import type { RatingBarProps } from './types';

export function RatingBar({
  rating,
  maxStars = 5,
  size = 20,
  readOnly = true,
  onRate,
  showValue = false,
  testID,
}: RatingBarProps) {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  const handlePress = useCallback(
    (starIndex: number) => {
      if (!readOnly && onRate) onRate(starIndex + 1);
    },
    [readOnly, onRate],
  );

  return (
    <View style={styles.row} testID={testID}>
      {Array.from({ length: maxStars }).map((_, i) => {
        const filled = i < Math.floor(rating);
        const half = !filled && i < rating;
        return (
          <TouchableOpacity
            key={i}
            onPress={() => handlePress(i)}
            disabled={readOnly}
            activeOpacity={readOnly ? 1 : 0.7}
          >
            <Text
              style={{
                fontSize: size,
                color: filled || half ? colors.warning : colors.border,
              }}
            >
              {filled ? '★' : half ? '⭐' : '☆'}
            </Text>
          </TouchableOpacity>
        );
      })}
      {showValue && (
        <Text style={styles.value}>{rating.toFixed(1)}</Text>
      )}
    </View>
  );
}
