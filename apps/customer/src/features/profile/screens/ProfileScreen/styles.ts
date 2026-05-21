import { StyleSheet } from 'react-native';
import type { AppColors } from '@dawwar/theme';
import { space, typography, radius, shadows, layout } from '@dawwar/theme';

export const createStyles = (colors: AppColors) =>
  StyleSheet.create({
    userCard: {
      alignItems: 'center',
      paddingVertical: space['2xl'],
      paddingHorizontal: layout.screenPaddingH,
      backgroundColor: colors.card,
      marginBottom: space.sm,
      gap: space.sm,
      borderBottomWidth: 1,
      borderBottomColor: colors.borderLight,
    },
    userName: {
      ...typography.h3,
      color: colors.text,
      fontWeight: '700',
      textAlign: 'center',
    },
    userPhone: {
      ...typography.body2,
      color: colors.textSecondary,
      textAlign: 'center',
    },
    avatarContainer: {
      position: 'relative',
    },
    editIconContainer: {
      position: 'absolute',
      bottom: 0,
      end: 0,
      backgroundColor: colors.primary,
      width: 28,
      height: 28,
      borderRadius: 14,
      borderWidth: 2,
      borderColor: colors.card,
      alignItems: 'center',
      justifyContent: 'center',
    },
    sectionLabel: {
      ...typography.overline,
      color: colors.textTertiary,
      paddingHorizontal: layout.screenPaddingH,
      paddingTop: space.lg,
      paddingBottom: space.sm,
      alignSelf: 'flex-start',
    },
    sectionCard: {
      backgroundColor: colors.card,
      marginBottom: space.xs,
      marginHorizontal: layout.screenPaddingH,
      borderRadius: radius.xl,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: colors.borderLight,
    },
    versionText: {
      ...typography.caption,
      color: colors.textDisabled,
      textAlign: 'center',
      paddingVertical: space.xl,
    },
    logoutRow: {
      backgroundColor: colors.card,
      marginTop: space.md,
      marginHorizontal: layout.screenPaddingH,
      borderRadius: radius.xl,
      borderWidth: 1,
      borderColor: colors.errorBg,
    },
  });
