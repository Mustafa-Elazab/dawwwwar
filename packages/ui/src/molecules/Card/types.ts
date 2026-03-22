import type { StyleProp, ViewStyle } from 'react-native';

export type CardVariant = 'elevated' | 'flat' | 'outlined';

export interface CardProps {
  variant?: CardVariant;
  onPress?: () => void;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  testID?: string;
  disabled?: boolean;
}
