import { StyleSheet, I18nManager } from 'react-native';
import type { AppColors } from '@dawwar/theme';
import { space, typography, radius } from '@dawwar/theme';

export const createStyles = (colors: AppColors) =>
  StyleSheet.create({
    userCard: {
      alignItems: 'center',
      padding: space.xl,
      backgroundColor: colors.card,
      marginBottom: space.sm,
      gap: space.sm,
    },
    userName: { 
      ...typography.h3, 
      color: colors.text,
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
      right: 0,
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
      ...typography.caption,
      color: colors.textSecondary,
      textTransform: 'uppercase',
      letterSpacing: 0.8,
      paddingHorizontal: space.base,
      paddingTop: space.base,
      paddingBottom: space.sm,
      flex:1,
      alignSelf:"flex-start",
    },
    sectionCard: {
      backgroundColor: colors.card,
      marginBottom: space.sm,
      borderRadius: radius.lg,
      overflow: 'hidden',
    },
    versionText: {
      ...typography.caption,
      color: colors.textDisabled,
      textAlign: 'center',
      padding: space.xl,
    },
    logoutRow: { 
      backgroundColor: colors.card, 
      marginTop: space.md,
      marginBottom: space.sm,
      borderWidth: 1,
      borderColor: `${colors.error}20`,
    },
  });
