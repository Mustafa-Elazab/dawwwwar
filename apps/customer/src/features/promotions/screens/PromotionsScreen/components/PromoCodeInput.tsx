import React from 'react';
import { Pressable, TextInput, View } from 'react-native';
import { Text } from '@dawwar/ui';
import type { AppColors } from '@dawwar/theme';
import type { createStyles } from '../styles';

interface PromoCodeInputProps {
  value: string;
  placeholder: string;
  applyLabel: string;
  colors: AppColors;
  styles: ReturnType<typeof createStyles>;
  onChangeText: (value: string) => void;
  onApply: () => void;
}

export function PromoCodeInput({
  value,
  placeholder,
  applyLabel,
  colors,
  styles,
  onChangeText,
  onApply,
}: PromoCodeInputProps) {
  return (
    <View style={styles.promoCodeRow}>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.placeholder}
        autoCapitalize="characters"
        style={styles.promoCodeInput}
      />
      <Pressable onPress={onApply} accessibilityRole="button">
        <Text style={styles.promoCodeApply}>{applyLabel}</Text>
      </Pressable>
    </View>
  );
}
