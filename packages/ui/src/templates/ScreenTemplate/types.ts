import type { StyleProp, ViewStyle } from 'react-native';
import type { Edge } from 'react-native-safe-area-context';

export interface ScreenTemplateProps {
  children: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  backgroundColor?: string;
  edges?: Edge[];
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  testID?: string;
}
