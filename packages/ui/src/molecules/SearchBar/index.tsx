import React from 'react';
import { TextInput, TouchableOpacity, View } from 'react-native';
import { useTheme } from '@dawwar/theme';
import { Icon } from '../../atoms';
import { createStyles } from './styles';
import type { SearchBarProps } from './types';

export function SearchBar({
  value,
  onChangeText,
  onFocus,
  onClear,
  placeholder = 'Search...',
  editable = true,
  autoFocus = false,
  style,
  testID,
}: SearchBarProps) {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  return (
    <View style={[styles.container, style]}>
      <Icon name="magnify" size={20} color={colors.textSecondary} />
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        onFocus={onFocus}
        placeholder={placeholder}
        placeholderTextColor={colors.placeholder}
        editable={editable}
        autoFocus={autoFocus}
        returnKeyType="search"
        testID={testID}
      />
      {value && value.length > 0 && onClear && (
        <TouchableOpacity style={styles.clearButton} onPress={onClear}>
          <Icon name="close-circle" size={18} color={colors.textSecondary} />
        </TouchableOpacity>
      )}
    </View>
  );
}
