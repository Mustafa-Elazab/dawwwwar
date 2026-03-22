export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface AvatarProps {
  uri?: string;
  name?: string;       // used for initials fallback
  size?: AvatarSize;
  testID?: string;
}
