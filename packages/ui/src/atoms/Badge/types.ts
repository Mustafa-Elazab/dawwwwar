import type { StyleProp, ViewStyle } from 'react-native';

export type BadgeVariant = 'success' | 'error' | 'warning' | 'info' | 'neutral' | 'primary';
export type BadgeSize = 'sm' | 'md';

export interface BadgeProps {
  label?: string;
  variant?: BadgeVariant;
  size?: BadgeSize;
  dot?: boolean;           // show only a colored dot, no label
  style?: StyleProp<ViewStyle>;
  testID?: string;
}
