import React from 'react';
import { View, Image } from 'react-native';
import { useTheme } from '@dawwar/theme';
import { Text, Icon, Button } from '../../atoms';
import { createStyles } from './styles';
import type { EmptyStateProps } from './types';

export function EmptyState({
  icon = 'inbox-outline',
  illustration,
  image,
  title,
  subtitle,
  action,
  testID,
}: EmptyStateProps) {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  const renderVisual = () => {
    if (illustration) return <View style={styles.visualContainer}>{illustration}</View>;
    if (image) return <Image source={image} style={styles.image} resizeMode="contain" />;
    
    return (
      <View style={styles.iconContainer}>
        <Icon name={icon} size={64} color={colors.primary} />
      </View>
    );
  };

  return (
    <View style={styles.container} testID={testID}>
      {renderVisual()}
      <Text style={styles.title}>{title}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      {action && (
        <Button
          label={action.label}
          onPress={action.onPress}
          variant={action.variant ?? 'primary'}
          style={styles.actionButton}
        />
      )}
    </View>
  );
}
