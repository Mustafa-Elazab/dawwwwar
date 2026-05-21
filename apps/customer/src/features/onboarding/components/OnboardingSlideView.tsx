import React from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { interpolate, useAnimatedStyle, type SharedValue } from 'react-native-reanimated';
import { Icon } from '@dawwar/ui';
import { Colors, radius, space } from '@dawwar/theme';
import type { OnboardingSlide } from '../onboarding.types';

export interface OnboardingSlideViewProps {
  slide: OnboardingSlide;
  progress: SharedValue<number>;
  index: number;
  width: number;
}

export function OnboardingSlideView({ slide, progress, index, width }: OnboardingSlideViewProps) {
  const visual = slide.visual ?? { type: slide.visualType, iconName: 'sparkles' };

  const animatedStyle = useAnimatedStyle(() => {
    const base = index * width;
    const distance = Math.min(Math.abs(progress.value - base), width);
    const opacity = 1 - distance / width;
    const scale = interpolate(distance, [0, width], [1, 0.92]);
    const translateY = interpolate(distance, [0, width], [0, 14]);

    return {
      opacity,
      transform: [{ translateY }, { scale }],
    };
  }, [index, width]);

  return (
    <View style={[styles.slide, { width }]}>
      <Animated.View style={[styles.visualWrap, animatedStyle]}>
        <View style={styles.illustrationCanvas}>
          <View style={styles.glowCircle} />
          <View style={styles.iconShell}>
            {visual.type === 'icon' && (
              <Icon name={visual.iconName ?? 'sparkles'} size={70} color={Colors.primary} />
            )}
          </View>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  slide: {
    flex: 1,
    justifyContent: 'center',
  },
  visualWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: space['2xl'],
  },
  illustrationCanvas: {
    width: 260,
    height: 260,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glowCircle: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: 'rgba(29,185,84,0.1)',
  },
  iconShell: {
    width: 138,
    height: 138,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1A1A1A',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
});
