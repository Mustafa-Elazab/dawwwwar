import React, { useEffect } from 'react';
import { View, Image } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { useTheme, springs } from '@dawwar/theme';
import { Button } from '../../atoms/Button';
import { Icon } from '../../atoms/Icon';
import { Text } from '../../atoms/Text';
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

  // ─── Animations ───────────────────────────────────────────────────
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.9);

  useEffect(() => {
    opacity.value = withSpring(1, springs.soft);
    scale.value = withSpring(1, springs.bouncy);
  }, [opacity, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  const renderVisual = () => {
    if (illustration)
      return <View style={styles.visualContainer}>{illustration}</View>;
    if (image)
      return (
        <Image source={image} style={styles.image} resizeMode="contain" />
      );

    return (
      <View style={styles.iconContainer}>
        <Icon name={icon} size={80} color={colors.primary} />
      </View>
    );
  };

  return (
    <Animated.View style={[styles.container, animatedStyle]} testID={testID}>
      {renderVisual()}
      <Text variant="h3" style={styles.title}>
        {title}
      </Text>
      {subtitle && (
        <Text variant="body1" style={styles.subtitle}>
          {subtitle}
        </Text>
      )}
      {action && (
        <Button
          label={action.label}
          onPress={action.onPress}
          variant={action.variant ?? 'primary'}
          style={styles.actionButton}
        />
      )}
    </Animated.View>
  );
}
