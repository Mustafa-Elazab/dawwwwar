import React from 'react';
import { View, StyleSheet } from 'react-native';
import Animated from 'react-native-reanimated';
import { Icon, Text } from '@dawwar/ui';
import { Colors, space, typography } from '@dawwar/theme';

type SplashAnimationStyles = {
  containerStyle: any;
  logoStyle: any;
  ring1Style: any;
  ring2Style: any;
  ring3Style: any;
  progressStyle: any;
};

export interface SplashContent {
  title?: string;
  subtitle?: string;
  logoIcon?: string;
}

export interface SplashScreenVisualProps {
  content?: SplashContent;
  animatedStyles: SplashAnimationStyles;
}

export function SplashScreenVisual({ content, animatedStyles }: SplashScreenVisualProps) {
  const title = content?.title ?? 'Dawwar';
  const logoIcon = content?.logoIcon ?? 'moped';

  return (
    <Animated.View style={[styles.container, animatedStyles.containerStyle]}>
      <Animated.View style={[styles.ring, animatedStyles.ring1Style]} />
      <Animated.View style={[styles.ring, animatedStyles.ring2Style]} />
      <Animated.View style={[styles.ring, animatedStyles.ring3Style]} />

      <Animated.View style={[styles.logoWrap, animatedStyles.logoStyle]}>
        <View style={styles.logoInner}>
          <Icon name={logoIcon} size={34} color={Colors.white} />
          <Text style={styles.title}>{title}</Text>
        </View>
      </Animated.View>

      <View style={styles.progressTrack}>
        <Animated.View style={[styles.progressBar, animatedStyles.progressStyle]} />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  ring: {
    position: 'absolute',
    width: 104,
    height: 104,
    borderRadius: 52,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.18)',
    backgroundColor: 'transparent',
  },
  logoWrap: {
    alignItems: 'center',
  },
  logoInner: {
    width: 160,
    height: 70,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    gap: space.xs,
  },
  title: {
    ...typography.h2,
    color: Colors.white,
    fontWeight: '900',
  },
  progressTrack: {
    position: 'absolute',
    bottom: 40,
    width: '40%',
    height: 2,
    backgroundColor: 'rgba(255,255,255,0.24)',
    borderRadius: 1,
    overflow: 'hidden',
  },
  progressBar: {
    width: '55%',
    height: 2,
    borderRadius: 1,
    backgroundColor: Colors.white,
  },
});
