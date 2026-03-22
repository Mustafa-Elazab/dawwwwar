import React from 'react';
import { View } from 'react-native';
import { useTheme } from '@dawwar/theme';
import { Text, Icon, Button } from '../../atoms';
import { createStyles } from './styles';
import type { EmptyStateProps } from './types';

export function EmptyState({
  icon = 'inbox-outline',
  title,
  subtitle,
  action,
  testID,
}: EmptyStateProps) {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  return (
    <View style={styles.container} testID={testID}>
      <Icon name={icon} size={64} color={colors.textDisabled} />
      <Text style={styles.title}>{title}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      {action && (
        <Button
          label={action.label}
          onPress={action.onPress}
          variant="outline"
          style={styles.actionButton}
        />
      )}
    </View>
  );
}
