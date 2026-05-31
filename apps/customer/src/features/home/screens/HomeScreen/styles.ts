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
      paddingTop: space.base,
      paddingBottom: space.sm,
      backgroundColor: colors.background,
    },
    headerTopRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 0,
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
    bagBtn: {
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
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: colors.primary,
    },
    locationBlock: {
      flex: 1,
      alignSelf: 'flex-start',
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
      paddingHorizontal: space.base,
      marginBottom: space.lg,
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
      marginBottom: space.md,
    },
    bannerWrapper: {
      borderRadius: radius.xl,
      overflow: 'hidden',
    },

    // ── Categories ──────────────────────────────────
    categoriesContent: {
      paddingHorizontal: space.base,
      paddingBottom: space.md,
      gap: space.md,
    },
    categoriesGrid: {
      paddingHorizontal: space.base,
      paddingBottom: space.md,
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      rowGap: space.md,
      direction: 'ltr',
    },
    categoryCard: {
      alignItems: 'center',
      width: '23%',
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
      writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr',
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
