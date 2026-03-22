import type { StyleProp, ViewStyle } from 'react-native';

export interface SkeletonProps {
  width: number | `${number}%`;
  height: number;
  borderRadius?: number;
  style?: StyleProp<ViewStyle>;
}
