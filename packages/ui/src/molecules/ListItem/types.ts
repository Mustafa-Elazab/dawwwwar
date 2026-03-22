import type { StyleProp, ViewStyle } from 'react-native';

export interface ListItemProps {
  title: string;
  subtitle?: string;
  leftElement?: React.ReactNode;
  rightElement?: React.ReactNode;
  onPress?: () => void;
  disabled?: boolean;
  showChevron?: boolean;    // auto-adds › arrow on right
  style?: StyleProp<ViewStyle>;
  testID?: string;
}
