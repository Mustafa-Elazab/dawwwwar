import { StyleSheet, I18nManager } from 'react-native';
import type { AppColors } from '@dawwar/theme';
import { space, typography, radius, shadows } from '@dawwar/theme';

export const createStyles = (colors: AppColors) =>
  StyleSheet.create({
    listContent: {
      padding: space.base,
    },
    
    // ── Add New Card ────────────────────────────────────
    addCard: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.surface,
      borderRadius: radius.lg,
      borderWidth: 2,
      borderColor: colors.primary,
      borderStyle: 'dashed',
      padding: space.lg,
      marginBottom: space.lg,
      gap: space.sm,
    },
    addText: {
      ...typography.label,
      color: colors.primary,
      fontWeight: '800',
    },

    // ── Address Card ────────────────────────────────────
    card: {
      backgroundColor: colors.card,
      borderRadius: 12, // Radius 12
      padding: space.md,
      marginBottom: space.md,
      ...shadows.sm,
      borderWidth: 1,
      borderColor: colors.borderLight,
      flexDirection: 'row',
      alignItems: 'center',
      gap: space.md,
      position: 'relative',
    },
    iconCircle: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.primaryMuted,
      alignItems: 'center',
      justifyContent: 'center',
    },
    info: {
      flex: 1,
      gap: 2,
      alignItems: 'flex-start',
    },
    labelRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: space.sm,
    },
    label: {
      ...typography.body1,
      color: colors.text,
      fontWeight: '800',
    },
    street: {
      ...typography.caption,
      color: colors.textSecondary,
      textAlign: 'left',
    },
    
    defaultBadge: {
      position: 'absolute',
      top: -8,
      right: I18nManager.isRTL ? 12 : undefined,
      left: I18nManager.isRTL ? undefined : 12,
      backgroundColor: colors.primary,
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: radius.full,
      ...shadows.sm,
    },
    defaultText: {
      ...typography.overline,
      color: '#fff',
      fontWeight: '800',
    },
    
    menuBtn: {
      padding: space.xs,
    },
  });
