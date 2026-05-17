import type { ReactNode } from 'react';

export interface EmptyStateProps {
  icon?: string;             // MaterialCommunityIcons name
  illustration?: ReactNode;  // Custom React Node (like an SVG)
  image?: any;               // Local required image or URI
  title: string;
  subtitle?: string;
  action?: {
    label: string;
    onPress: () => void;
    variant?: 'primary' | 'outline' | 'ghost'; // Allow primary CTA
  };
  testID?: string;
}
