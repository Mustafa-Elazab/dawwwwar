import type { StyleProp, ViewStyle } from 'react-native';

export interface SearchBarProps {
  value?: string;
  onChangeText?: (text: string) => void;
  onFocus?: () => void;
  onClear?: () => void;
  placeholder?: string;
  editable?: boolean;
  autoFocus?: boolean;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}
