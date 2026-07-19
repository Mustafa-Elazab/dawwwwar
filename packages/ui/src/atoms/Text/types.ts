import type { StyleProp, TextProps as RNTextProps, TextStyle } from 'react-native';
import type { TypographyVariant } from '@dawwar/theme';

export interface TextProps {
  variant?: TypographyVariant;
  color?: string;
  align?: 'auto' | 'left' | 'right' | 'center' | 'justify';
  numberOfLines?: number;
  ellipsizeMode?: RNTextProps['ellipsizeMode'];
  selectable?: boolean;
  onPress?: () => void;
  style?: StyleProp<TextStyle>;
  children?: React.ReactNode;
  testID?: string;
}
