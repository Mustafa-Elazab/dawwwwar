import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import type { HeaderAction } from '../../organisms/Header/types';

export interface HeaderTemplateProps {
  title?: string;
  subtitle?: string;
  showBack?: boolean;
  onBackPress?: () => void;
  leftAction?: HeaderAction;
  rightAction?: HeaderAction;
  leftComponent?: ReactNode;
  rightComponent?: ReactNode;
  actions?: ReactNode;
  searchSlot?: ReactNode;
  transparent?: boolean;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}
