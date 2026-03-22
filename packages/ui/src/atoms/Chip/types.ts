import type { StyleProp, ViewStyle } from 'react-native';

export interface ChipProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  onDismiss?: () => void;    // shows × button when provided
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}
