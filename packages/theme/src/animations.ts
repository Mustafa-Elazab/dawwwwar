import { WithSpringConfig, Easing } from 'react-native-reanimated';

/**
 * Standard spring configurations for the design system.
 * Use these to ensure micro-interactions feel consistent and premium.
 *
 * Guide:
 *  - `snappy`  → instant feedback (press scale, toggles)
 *  - `stiff`   → responsive, slight overshoot (buttons, chips)
 *  - `bouncy`  → playful overshoot (FAB, badges, toasts)
 *  - `soft`    → organic ease-in (cards, overlays)
 *  - `gentle`  → slow entrance (bottom sheets, modals)
 *  - `heavy`   → high mass = sluggish momentum (drag release)
 */
export const springs = {
  /** Snap — near-instant response, no overshoot */
  snappy: {
    stiffness: 300,
    damping: 30,
    mass: 0.8,
  } as WithSpringConfig,

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

  /** Heavy mass — for drag-release and momentum effects */
  heavy: {
    stiffness: 120,
    damping: 20,
    mass: 2,
  } as WithSpringConfig,
} as const;

export type SpringKey = keyof typeof springs;

/**
 * Standard transition durations for non-spring animations.
 */
export const transitions = {
  instant: 100,
  fast: 150,
  base: 250,
  slow: 400,
  xslow: 600,
} as const;

/**
 * Standard easing curves mirroring Material Design 3.
 */
export const easings = {
  /** Standard — for most transitions */
  standard: Easing.bezier(0.2, 0, 0, 1),
  /** Emphasized — for hero/entrance animations */
  emphasized: Easing.bezier(0.2, 0, 0, 1),
  /** Decelerate — for elements entering the screen */
  decelerate: Easing.out(Easing.cubic),
  /** Accelerate — for elements leaving the screen */
  accelerate: Easing.in(Easing.cubic),
} as const;

/**
 * Common micro-interaction presets for consistent touch feedback.
 */
export const microInteractions = {
  /** Standard press scale-down */
  pressScale: 0.98,
  /** Subtle press for larger surfaces (cards) */
  cardPressScale: 0.99,
  /** Active opacity for pressed states */
  pressOpacity: 0.94,
  /** Larger scale for attention (badges, notifications) */
  popScale: 1.04,
} as const;

/**
 * Motion tokens for screen-level and content-level transitions.
 */
export const motion = {
  pageEnterMs: 420,
  pageExitMs: 260,
  staggerMs: 36,
  tooltipMs: 180,
  skeletonPulseMs: 1200,
  skeletonShimmerMs: 1400,
  skeletonDelayMs: 200,
  bottomSheetMs: 420,
  tabSwitchMs: 220,
  splashEnterMs: 520,
  splashExitMs: 360,
  splashFloatMs: 2600,
  onboardingEnterMs: 360,
  onboardingCtaMs: 240,
  onboardingPaginationMs: 220,
  onboardingBgMs: 420,
  shakeMs: 60,
} as const;
