import { ReactNode } from 'react';
import { ViewStyle } from 'react-native';

export interface HeaderProps {
  title?: string;
  subtitle?: string;
  leftComponent?: ReactNode;
  rightComponent?: ReactNode;
  type?: 'default' | 'none';
  onBackPress?: () => void;
  style?: ViewStyle;
}
