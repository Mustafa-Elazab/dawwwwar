import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';

export interface ModalSheetTemplateProps {
  visible: boolean;
  title?: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
  onClose: () => void;
  closeLabel?: string;
  maxHeight?: number | `${number}%`;
  dismissOnBackdropPress?: boolean;
  contentStyle?: StyleProp<ViewStyle>;
  testID?: string;
}
