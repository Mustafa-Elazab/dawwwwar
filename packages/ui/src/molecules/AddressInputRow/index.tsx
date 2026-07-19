import React from 'react';
import { ActivityIndicator, Pressable, View } from 'react-native';
import { useTheme } from '@dawwar/theme';
import { Icon } from '../../atoms/Icon';
import { Text } from '../../atoms/Text';
import { createStyles } from './styles';

export interface AddressInputRowProps {
  address?: string;
  placeholder: string;
  loading?: boolean;
  onPressLocation?: () => void;
  testID?: string;
}

export function AddressInputRow({
  address,
  placeholder,
  loading = false,
  onPressLocation,
  testID,
}: AddressInputRowProps) {
  const { colors } = useTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);
  const hasAddress = !!address?.trim();

  return (
    <View style={styles.container} testID={testID}>
      <Pressable
        style={styles.iconButton}
        onPress={onPressLocation}
        hitSlop={8}
        accessibilityRole="button"
      >
        <Icon name="crosshairs-gps" size={20} color={colors.primary} />
      </Pressable>
      <View style={styles.textContainer}>
        {loading ? (
          <ActivityIndicator size="small" color={colors.primary} />
        ) : (
          <Text
            numberOfLines={2}
            style={[styles.addressText, !hasAddress && styles.placeholderText]}
          >
            {hasAddress ? address : placeholder}
          </Text>
        )}
      </View>
    </View>
  );
}
