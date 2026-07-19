import React from 'react';
import { ActivityIndicator, Image, Pressable, View } from 'react-native';
import { Icon } from '@dawwar/ui';
import type { AppColors } from '@dawwar/theme';
import type { createStyles } from '../styles';

interface ProfileAvatarPickerProps {
  avatarUri?: string;
  isLoading: boolean;
  colors: AppColors;
  styles: ReturnType<typeof createStyles>;
  onPress: () => void;
}

export function ProfileAvatarPicker({
  avatarUri,
  isLoading,
  colors,
  styles,
  onPress,
}: ProfileAvatarPickerProps) {
  return (
    <View style={styles.avatarSection}>
      <Pressable style={styles.avatarButton} onPress={onPress} accessibilityRole="button">
        {avatarUri ? (
          <Image source={{ uri: avatarUri }} style={styles.avatarImage} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <View style={styles.avatarHead} />
            <View style={styles.avatarBody} />
          </View>
        )}
        <View style={styles.avatarEdit}>
          {isLoading ? (
            <ActivityIndicator size="small" color={colors.primaryText} />
          ) : (
            <Icon name="pencil" size={22} color={colors.primaryText} />
          )}
        </View>
      </Pressable>
    </View>
  );
}
