import { StyleSheet, I18nManager } from 'react-native';
import type { AppColors } from '@dawwar/theme';
import { space, typography, radius, shadows } from '@dawwar/theme';

export const createStyles = (colors: AppColors) =>
  StyleSheet.create({
    scrollContent: {
      paddingBottom: 120,
    },

    // ── Header ──────────────────────────────────────
    headerContainer: {
      paddingHorizontal: space.base,
      paddingTop: space.sm,
      paddingBottom: space.md,
      backgroundColor: colors.background,
    },
    headerTopRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: space.sm,
    },
    greetingWrapper: {
      flex: 1,
      alignItems: 'flex-start',
    },
    greetingText: {
      ...typography.h3,
      color: colors.text,
      fontWeight: '800',
    },
    bellBtn: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: colors.surface,
      alignItems: 'center',
      justifyContent: 'center',
      ...shadows.sm,
      borderWidth: 1,
      borderColor: colors.borderLight,
    },
    badgeDot: {
      position: 'absolute',
      top: 10,
      end: 12,
      width: 10,
      height: 10,
      borderRadius: 5,
      backgroundColor: colors.error,
      borderWidth: 1.5,
      borderColor: colors.surface,
    },
    locationBlock: {
      alignSelf: 'flex-start',
      marginBottom: space.md,
      maxWidth: '100%',
    },
    deliveringLabel: {
      ...typography.caption,
      color: colors.textSecondary,
      fontWeight: '600',
      marginBottom: 2,
      textAlign: 'auto',
    },
    locationRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    locationPrimary: {
      ...typography.body1,
      color: colors.text,
      fontWeight: '800',
      flexShrink: 1,
      textAlign: 'auto',
    },

    // ── Search ──────────────────────────────────────
    searchWrapper: {
      marginTop: space.xs,
    },
    searchTap: {
      height: 48,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.surface,
      borderRadius: radius.md, 
      paddingHorizontal: space.md,
      gap: space.sm,
      ...shadows.sm,
      borderWidth: 1,
      borderColor: colors.borderLight,
    },
    filterBtn: {
      padding: space.xs,
      borderEndWidth: 1,
      borderColor: colors.border,
      marginEnd: space.xs,
    },
    searchPlaceholder: {
      ...typography.body2,
      color: colors.placeholder,
      flex: 1,
      textAlign: 'auto',
    },

    // ── Banner ──────────────────────────────────────
    bannerContainer: {
      paddingHorizontal: space.base,
      marginBottom: space.lg,
    },
    bannerWrapper: {
      borderRadius: radius.xl,
      overflow: 'hidden',
    },

    // ── Categories ──────────────────────────────────
    categoriesContent: {
      paddingHorizontal: space.base,
      paddingBottom: space.lg,
      gap: space.md,
    },
    categoryCard: {
      alignItems: 'center',
      width: 72,
    },
    categoryIconCircle: {
      width: 64,
      height: 64,
      borderRadius: radius.lg,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: space.xs,
      ...shadows.sm,
    },
    categoryLabel: {
      ...typography.caption,
      color: colors.text,
      fontWeight: '700',
      textAlign: 'center',
      maxWidth: 72,
    },
    categoryEmoji: {
      fontSize: 28,
      textAlign: 'center',
    },
    categoriesEmpty: {
      paddingVertical: space.md,
      paddingHorizontal: space.base,
    },
    categoriesEmptyText: {
      ...typography.body2,
      color: colors.textSecondary,
      textAlign: 'auto',
    },

    // ── Lists ───────────────────────────────────────
    merchantsList: {
      paddingHorizontal: space.base,
      paddingBottom: space.md,
    },
    productsGrid: {
      paddingHorizontal: space.base,
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: space.md,
    },
    productGridItem: {
      width: '47.5%',
    },
    skeletonRow: {
      paddingHorizontal: space.base,
      flexDirection: 'row',
      marginBottom: space.lg,
    },
    skeletonGrid: {
      paddingHorizontal: space.base,
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: space.md,
      marginBottom: space.lg,
    },
    skeletonGridItem: {
      width: '47.5%',
    },

    // ── FAB ─────────────────────────────────────────
    fab: {
      position: 'absolute',
      bottom: 90,
      end: space.base,
      flexDirection: 'row',
      backgroundColor: colors.primary,
      borderRadius: radius.full,
      paddingHorizontal: space.lg,
      paddingVertical: space.md,
      alignItems: 'center',
      gap: 8,
      ...shadows.md,
      elevation: 6,
    },
    fabText: {
      ...typography.label,
      color: '#fff',
      fontWeight: '800',
    },

    // ── Discovery Toggle ────────────────────────────
    toggleRow: {
      flexDirection: 'row',
      backgroundColor: colors.surfaceVariant,
      borderRadius: radius.lg,
      padding: 4,
      marginHorizontal: space.base,
      marginBottom: space.lg,
    },
    toggleBtn: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 10,
      borderRadius: radius.md,
      gap: 6,
    },
    toggleBtnActive: {
      backgroundColor: colors.surface,
      ...shadows.sm,
    },
    toggleLabel: {
      ...typography.caption,
      color: colors.textSecondary,
      fontWeight: '700',
    },
    toggleLabelActive: {
      color: colors.primary,
    },
  });
