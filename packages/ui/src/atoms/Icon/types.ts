import type { StyleProp, TextStyle } from 'react-native';

export interface IconProps {
  name: string;         // MaterialCommunityIcons name
  size?: number;
  color?: string;
  testID?: string;
  style?: StyleProp<TextStyle>;
}
