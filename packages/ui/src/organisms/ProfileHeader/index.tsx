import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme, radius, spacing } from '@dawwar/theme';
import { AppAvatar, AppButton, AppIcon, AppPressable, AppText } from '../../atoms';

export interface ProfileHeaderProps {
  name?: string;
  phone?: string;
  email?: string;
  avatarUri?: string;
  editLabel?: string;
  loginLabel?: string;
  onEditPress?: () => void;
  onLoginPress?: () => void;
}

export function ProfileHeader({
  name,
  phone,
  email,
  avatarUri,
  editLabel,
  loginLabel,
  onEditPress,
  onLoginPress,
}: ProfileHeaderProps) {
  const { colors } = useTheme();

  if (!name) {
    return (
      <View style={[styles.login, { backgroundColor: colors.primaryLight }]}>
        <AppButton label={loginLabel ?? ''} onPress={onLoginPress} fullWidth />
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <AppAvatar uri={avatarUri} name={name} size="xl" />
      <View style={styles.copy}>
        <AppText variant="h4" color={colors.primary} numberOfLines={1}>{name}</AppText>
        {phone ? (
          <View style={styles.meta}>
            <AppIcon name="phone-outline" size={14} color={colors.textSecondary} />
            <AppText variant="caption" color={colors.textSecondary}>{phone}</AppText>
          </View>
        ) : null}
        {email ? (
          <View style={styles.meta}>
            <AppIcon name="email-outline" size={14} color={colors.textSecondary} />
            <AppText variant="caption" color={colors.textSecondary}>{email}</AppText>
          </View>
        ) : null}
      </View>
      <AppPressable style={[styles.edit, { backgroundColor: colors.primary }]} onPress={onEditPress}>
        <AppIcon name="pencil" size={20} color={colors.primaryText} />
        {editLabel ? <AppText variant="caption" color={colors.primaryText}>{editLabel}</AppText> : null}
      </AppPressable>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
  },
  copy: {
    flex: 1,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1],
    marginTop: spacing[1],
  },
  edit: {
    minWidth: 44,
    height: 44,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  login: {
    borderRadius: radius.xl,
    padding: spacing[4],
  },
});
