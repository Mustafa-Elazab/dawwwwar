import type { StyleProp, ViewStyle } from 'react-native';
import type { Edge } from 'react-native-safe-area-context';
import type { HeaderProps } from '../../organisms/Header/types';

export interface ScreenTemplateProps {
  children?: React.ReactNode;
  header?: React.ReactNode;
  headerProps?: HeaderProps;
  footer?: React.ReactNode;
  backgroundColor?: string;
  edges?: Edge[];
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  testID?: string;
}
