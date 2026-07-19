import React from 'react';
import {
  KeyboardTypeOptions,
  Pressable,
  TextInput,
  View,
} from 'react-native';
import { Icon, Text } from '@dawwar/ui';
import type { AppColors } from '@dawwar/theme';
import type { createStyles } from '../styles';

interface ProfileFieldRowProps {
  value?: string;
  placeholder: string;
  isRTL: boolean;
  editable?: boolean;
  keyboardType?: KeyboardTypeOptions;
  leftAccessory?: React.ReactNode;
  rightIcon?: string;
  error?: string;
  colors: AppColors;
  styles: ReturnType<typeof createStyles>;
  onChangeText?: (text: string) => void;
  onPress?: () => void;
}

export function ProfileFieldRow({
  value,
  placeholder,
  isRTL,
  editable = true,
  keyboardType = 'default',
  leftAccessory,
  rightIcon,
  error,
  colors,
  styles,
  onChangeText,
  onPress,
}: ProfileFieldRowProps) {
  const row = (
    <View style={[styles.field, error ? styles.fieldError : null]}>
      {leftAccessory ? <View style={styles.fieldAccessory}>{leftAccessory}</View> : null}
      {onChangeText ? (
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.placeholder}
          editable={editable}
          keyboardType={keyboardType}
          style={styles.fieldInput}
          textAlign={isRTL ? 'right' : 'left'}
        />
      ) : (
        <Text
          style={[
            styles.fieldText,
            !value ? styles.fieldPlaceholder : null,
          ]}
          numberOfLines={1}
        >
          {value || placeholder}
        </Text>
      )}
      {rightIcon ? <Icon name={rightIcon} size={23} color={colors.text} /> : null}
    </View>
  );

  return (
    <>
      {onPress ? (
        <Pressable onPress={onPress} accessibilityRole="button">
          {row}
        </Pressable>
      ) : row}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </>
  );
}
