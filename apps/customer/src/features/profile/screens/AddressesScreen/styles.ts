import { StyleSheet } from 'react-native';
import type { AppColors } from '@dawwar/theme';
import { space, typography, radius, shadows, layout } from '@dawwar/theme';

export const createStyles = (colors: AppColors) =>
  StyleSheet.create({
    listContent: {
      padding: layout.screenPaddingH,
    },

    // ── Add New Card ────────────────────────────────────
    addCard: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.primaryLight,
      borderRadius: radius.xl,
      borderWidth: 1.5,
      borderColor: colors.primary,
      borderStyle: 'dashed',
      padding: space.lg,
      marginBottom: space.lg,
      gap: space.sm,
    },
    addText: {
      ...typography.label,
      color: colors.primary,
      fontWeight: '700',
    },

    // ── Address Card ────────────────────────────────────
    card: {
      backgroundColor: colors.card,
      borderRadius: radius.xl,
      padding: space.md,
      marginBottom: space.md,
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
      borderRadius: radius.full,
      backgroundColor: colors.primaryLight,
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
      fontWeight: '700',
    },
    street: {
      ...typography.caption,
      color: colors.textSecondary,
    },

    defaultBadge: {
      position: 'absolute',
      top: -8,
      start: 12,
      backgroundColor: colors.primary,
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: radius.full,
    },
    defaultText: {
      ...typography.overline,
      color: '#fff',
      fontWeight: '700',
    },

    menuBtn: {
      padding: space.xs,
    },
  });
