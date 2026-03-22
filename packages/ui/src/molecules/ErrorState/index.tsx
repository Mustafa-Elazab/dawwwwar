import React from 'react';
import { View } from 'react-native';
import { useTheme } from '@dawwar/theme';
import { Text, Icon, Button } from '../../atoms';
import { createStyles } from './styles';
import type { ErrorStateProps } from './types';

export function ErrorState({
  message = 'Something went wrong. Please try again.',
  onRetry,
  testID,
}: ErrorStateProps) {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  return (
    <View style={styles.container} testID={testID}>
      <Icon name="alert-circle-outline" size={56} color={colors.error} />
      <Text style={styles.message}>{message}</Text>
      {onRetry && (
        <Button label="Try Again" onPress={onRetry} variant="outline" />
      )}
    </View>
  );
}
