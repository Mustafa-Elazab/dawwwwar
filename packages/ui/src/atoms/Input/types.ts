import type { StyleProp, ViewStyle, KeyboardTypeOptions, TextInputProps } from 'react-native';

export interface InputProps {
  label?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  placeholder?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  secureTextEntry?: boolean;
  keyboardType?: KeyboardTypeOptions;
  multiline?: boolean;
  numberOfLines?: number;
  editable?: boolean;
  maxLength?: number;
  autoFocus?: boolean;
  onBlur?: () => void;
  onFocus?: () => void;
  containerStyle?: StyleProp<ViewStyle>;
  testID?: string;
}
