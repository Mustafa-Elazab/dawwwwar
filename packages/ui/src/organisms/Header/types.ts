import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';

export interface HeaderAction {
  icon: string;
  onPress: () => void;
  testID?: string;
}

export interface HeaderProps {
  title?: string;
  subtitle?: string;
  leftAction?: HeaderAction;
  rightAction?: HeaderAction;
  leftComponent?: ReactNode;
  rightComponent?: ReactNode;
  bottomComponent?: ReactNode;
  type?: 'default' | 'none';
  onBackPress?: () => void;
  transparent?: boolean;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}
