import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useTheme } from '@dawwar/theme';
import { Text } from '../../atoms';
import { createStyles } from './styles';
import type { LoadingSpinnerProps } from './types';

export function LoadingSpinner({
  fullscreen = false,
  message,
  testID,
}: LoadingSpinnerProps) {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  return (
    <View style={fullscreen ? styles.fullscreen : styles.inline} testID={testID}>
      <ActivityIndicator size="large" color={colors.primary} />
      {message && <Text style={styles.message}>{message}</Text>}
    </View>
  );
}
