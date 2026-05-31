import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import type { AppColors } from '@dawwar/theme';
import { Text } from '@dawwar/ui';
import { Language } from '@dawwar/types';
import { createStyles } from '../styles';

export interface LanguageOption {
  value: Language;
  flag: string;
  label: string;
}

interface LanguageOptionsProps {
  colors: AppColors;
  options: readonly LanguageOption[];
  currentLanguage: Language;
  onSelect: (language: Language) => void;
}

export function LanguageOptions({
  colors,
  options,
  currentLanguage,
  onSelect,
}: LanguageOptionsProps) {
  const styles = createStyles(colors);

  return (
    <View style={styles.card}>
      {options.map((language, index) => (
        <TouchableOpacity
          key={language.value}
          style={[
            styles.optionRow,
            index === options.length - 1 && styles.optionRowLast,
          ]}
          onPress={() => onSelect(language.value)}
        >
          <View style={styles.optionLeft}>
            <Text style={styles.flag}>{language.flag}</Text>
            <Text style={styles.optionLabel}>{language.label}</Text>
          </View>
          <View style={[
            styles.radio,
            currentLanguage === language.value && styles.radioSelected,
          ]}>
            {currentLanguage === language.value ? <View style={styles.radioDot} /> : null}
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
}
