export interface EmptyStateProps {
  icon?: string;             // MaterialCommunityIcons name
  title: string;
  subtitle?: string;
  action?: {
    label: string;
    onPress: () => void;
  };
  testID?: string;
}
