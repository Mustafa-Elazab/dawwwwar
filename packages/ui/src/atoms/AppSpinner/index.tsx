import React from 'react';
import { ActivityIndicator, View, type StyleProp, type ViewStyle } from 'react-native';
import { useTheme } from '@dawwar/theme';
import { Text } from '../Text';

export interface AppSpinnerProps {
  message?: string;
  size?: 'small' | 'large';
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

export function AppSpinner({
  message,
  size = 'large',
  style,
  testID,
}: AppSpinnerProps) {
  const { colors } = useTheme();

  return (
    <View style={[{ alignItems: 'center', justifyContent: 'center', gap: 12 }, style]} testID={testID}>
      <ActivityIndicator size={size} color={colors.primary} />
      {message ? <Text variant="body2" color={colors.textSecondary}>{message}</Text> : null}
    </View>
  );
}
