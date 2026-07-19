import { StyleSheet } from 'react-native';
import type { AppColors } from '@dawwar/theme';
import { radius, spacing } from '@dawwar/theme';

export const createStyles = (colors: AppColors) =>
  StyleSheet.create({
    row: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: spacing[3],
      padding: spacing[4],
      borderBottomWidth: 1,
      borderBottomColor: colors.borderLight,
    },
    rowRead: {
      backgroundColor: colors.background,
    },
    rowUnread: {
      backgroundColor: colors.surface,
    },
    iconContainer: {
      width: 48,
      height: 48,
      borderRadius: radius.full,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.surfaceVariant,
    },
    content: {
      flex: 1,
    },
    titleRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: spacing[1],
      alignItems: 'center',
    },
    title: {
      flex: 1,
      color: colors.text,
      textAlign: 'auto',
    },
    titleRead: {
      fontWeight: '500',
    },
    titleUnread: {
      fontWeight: '700',
    },
    unreadDot: {
      width: spacing[2],
      height: spacing[2],
      borderRadius: radius.full,
      backgroundColor: colors.primary,
      marginStart: spacing[2],
    },
    body: {
      color: colors.textSecondary,
      marginBottom: spacing[2],
      lineHeight: 20,
      textAlign: 'auto',
      writingDirection: 'rtl',
    },
    time: {
      color: colors.textDisabled,
      textAlign: 'auto',
    },
  });
