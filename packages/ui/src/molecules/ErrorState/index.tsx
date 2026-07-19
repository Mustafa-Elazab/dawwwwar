import React, { useEffect } from 'react';
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
import type { ErrorStateProps } from './types';

export function ErrorState({
  message = 'Something went wrong. Please try again.',
  onRetry,
  testID,
}: ErrorStateProps) {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  // ─── Animations ───────────────────────────────────────────────────
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(10);

  useEffect(() => {
    opacity.value = withSpring(1, springs.soft);
    translateY.value = withSpring(0, springs.soft);
  }, [opacity, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View style={[styles.container, animatedStyle]} testID={testID}>
      <Icon name="alert-circle-outline" size={64} color={colors.error} />
      <Text variant="h3" style={styles.message}>
        {message}
      </Text>
      {onRetry && (
        <Button
          label="Try Again"
          onPress={onRetry}
          variant="outline"
          style={{ marginTop: 16 }}
        />
      )}
    </Animated.View>
  );
}
