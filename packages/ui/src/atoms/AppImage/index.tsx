import React, { useState } from 'react';
import {
  Image,
  View,
  type ImageProps,
  type ImageSourcePropType,
  type ImageStyle,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { useTheme } from '@dawwar/theme';
import { Icon } from '../Icon';

export interface AppImageProps extends Omit<ImageProps, 'source' | 'style'> {
  source?: ImageSourcePropType | null;
  uri?: string | null;
  style?: StyleProp<ImageStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  fallbackIcon?: string;
}

export function AppImage({
  source,
  uri,
  style,
  containerStyle,
  fallbackIcon = 'image-outline',
  resizeMode = 'cover',
  onError,
  ...props
}: AppImageProps) {
  const { colors } = useTheme();
  const [hasError, setHasError] = useState(false);
  const resolvedSource = source ?? (uri ? { uri } : undefined);

  if (!resolvedSource || hasError) {
    return (
      <View
        style={[
          {
            backgroundColor: colors.surfaceVariant,
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
          },
          style as StyleProp<ViewStyle>,
          containerStyle,
        ]}
      >
        <Icon name={fallbackIcon} size={24} color={colors.textTertiary} />
      </View>
    );
  }

  return (
    <Image
      {...props}
      source={resolvedSource}
      resizeMode={resizeMode}
      style={style}
      onError={(event) => {
        setHasError(true);
        onError?.(event);
      }}
    />
  );
}
