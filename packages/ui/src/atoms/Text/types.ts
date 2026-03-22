import type { StyleProp, TextStyle } from 'react-native';
import type { TypographyVariant } from '@dawwar/theme';

export interface TextProps {
  variant?: TypographyVariant;
  color?: string;
  align?: 'auto' | 'left' | 'right' | 'center' | 'justify';
  numberOfLines?: number;
  selectable?: boolean;
  style?: StyleProp<TextStyle>;
  children?: React.ReactNode;
  testID?: string;
}
