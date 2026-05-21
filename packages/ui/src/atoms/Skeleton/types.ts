import type { StyleProp, ViewStyle } from 'react-native';

export type SkeletonVariant = 'rectangular' | 'circular' | 'text';

export interface SkeletonProps {
  width: number | `${number}%`;
  height: number;
  borderRadius?: number;
  /** Shape variant — circular auto-sets borderRadius, text uses smaller radius */
  variant?: SkeletonVariant;
  style?: StyleProp<ViewStyle>;
}
