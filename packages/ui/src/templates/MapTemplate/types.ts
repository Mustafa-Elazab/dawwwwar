import type { ReactNode } from 'react';
import type { KeyboardAvoidingViewProps, StyleProp, ViewProps, ViewStyle } from 'react-native';

export interface MapTemplateProps {
  header?: ReactNode;
  map: ReactNode;
  content?: ReactNode;
  footer?: ReactNode;
  keyboardBehavior?: KeyboardAvoidingViewProps['behavior'];
  style?: StyleProp<ViewStyle>;
  mapContainerStyle?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
  contentPointerEvents?: ViewProps['pointerEvents'];
}
