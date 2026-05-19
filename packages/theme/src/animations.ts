import { WithSpringConfig } from 'react-native-reanimated';

/**
 * Standard spring configurations for the design system.
 * Use these to ensure micro-interactions feel consistent and premium.
 */
export const springs = {
  /** High stiffness, low damping — for immediate response */
  stiff: {
    stiffness: 150,
    damping: 20,
    mass: 1,
  } as WithSpringConfig,

  /** Standard bouncy feel — for buttons and interactive elements */
  bouncy: {
    stiffness: 100,
    damping: 10,
    mass: 1,
  } as WithSpringConfig,

  /** Low stiffness, high damping — for natural, organic movements */
  soft: {
    stiffness: 80,
    damping: 20,
    mass: 1,
  } as WithSpringConfig,

  /** Very slow and smooth — for modal/bottom sheet entrances */
  gentle: {
    stiffness: 50,
    damping: 25,
    mass: 1,
  } as WithSpringConfig,
} as const;

export type SpringKey = keyof typeof springs;

/**
 * Standard transition durations for non-spring animations.
 */
export const transitions = {
  fast: 150,
  base: 250,
  slow: 400,
} as const;
