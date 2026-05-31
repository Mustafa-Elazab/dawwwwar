import React from 'react';
import { Animated, View } from 'react-native';
import type { AppColors } from '@dawwar/theme';
import { Icon } from '@dawwar/ui';
import { createStyles } from '../styles';

interface SplashContentProps {
  colors: AppColors;
  brand: string;
  version: string;
  tagline: string;
  fadeAnim: Animated.Value;
  scaleAnim: Animated.Value;
  pulseAnim: Animated.Value;
  titleOpacity: Animated.Value;
  versionOpacity: Animated.Value;
  taglineOpacity: Animated.Value;
}

export function SplashContent({
  colors,
  brand,
  version,
  tagline,
  fadeAnim,
  scaleAnim,
  pulseAnim,
  titleOpacity,
  versionOpacity,
  taglineOpacity,
}: SplashContentProps) {
  const styles = createStyles(colors);

  return (
    <View style={styles.content}>
      <Animated.View
        style={[
          styles.animatedContent,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }, { scale: pulseAnim }],
          },
        ]}
      >
        <View style={styles.iconContainer}>
          <Icon name="moped" size={80} color={colors.primary} />
        </View>
        <Animated.Text style={[styles.brandName, { opacity: titleOpacity }]}>
          {brand}
        </Animated.Text>
        <Animated.Text style={[styles.version, { opacity: versionOpacity }]}>
          {version}
        </Animated.Text>
        <Animated.Text style={[styles.tagline, { opacity: taglineOpacity }]}>
          {tagline}
        </Animated.Text>
      </Animated.View>
    </View>
  );
}
