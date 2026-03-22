import type { StyleProp, ViewStyle } from 'react-native';

export interface DividerProps {
  orientation?: 'horizontal' | 'vertical';
  thickness?: number;
  color?: string;
  style?: StyleProp<ViewStyle>;
}
