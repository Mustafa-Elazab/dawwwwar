import type { StyleProp, ViewStyle } from 'react-native';

export interface HeaderAction {
  icon: string;
  onPress: () => void;
  testID?: string;
}

export interface HeaderProps {
  title?: string;
  leftAction?: HeaderAction;
  rightAction?: HeaderAction;
  transparent?: boolean;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}
