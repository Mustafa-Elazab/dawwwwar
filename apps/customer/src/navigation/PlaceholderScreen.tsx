import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from '@dawwar/ui';
import { useTheme } from '@dawwar/theme';

export function createPlaceholder(routeName: string, taskNumber?: number) {
  return function PlaceholderScreen() {
    const { colors } = useTheme();
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text variant="h3" color={colors.textSecondary}>
          {routeName}
        </Text>
        {taskNumber != null && (
          <Text variant="body2" color={colors.textDisabled}>
            {`Built in Task ${String(taskNumber).padStart(2, '0')}`}
          </Text>
        )}
      </View>
    );
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
});
