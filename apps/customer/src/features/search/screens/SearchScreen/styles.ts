import { StyleSheet, I18nManager } from 'react-native';
import type { AppColors } from '@dawwar/theme';
import { space, typography, radius } from '@dawwar/theme';

export const createStyles = (colors: AppColors) =>
  StyleSheet.create({
    searchRow: {
      flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
      alignItems: 'center',
      gap: space.sm,
      padding: space.sm,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    backBtn: {
      padding: space.sm,
      flexShrink: 0,
    },
    searchBarWrapper: { flex: 1 },
    sectionHeader: {
      ...typography.label,
      color: colors.textSecondary,
      textTransform: 'uppercase',
      letterSpacing: 0.8,
      paddingHorizontal: space.base,
      paddingTop: space.base,
      paddingBottom: space.sm,
      backgroundColor: colors.surface,
    },
    loadingRow: {
      alignItems: 'center',
      paddingVertical: space.xl,
    },
    emptyContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: space['3xl'],
      gap: space.md,
    },
    emptyText: {
      ...typography.body1,
      color: colors.textSecondary,
    },
    emptySubText: {
      ...typography.body2,
      color: colors.textDisabled,
    },
    // Category chip row
    categoryRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: space.sm,
      paddingHorizontal: space.base,
      paddingVertical: space.sm,
    },
    categoryChip: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: space.sm,
      paddingHorizontal: space.md,
      paddingVertical: space.sm,
      backgroundColor: colors.primaryMuted,
      borderRadius: radius.full,
    },
    categoryEmoji: { fontSize: 16 },
    categoryLabel: {
      ...typography.label,
      color: colors.primary,
    },
    // Merchant result row
    merchantRow: {
      flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
      alignItems: 'center',
      gap: space.md,
      paddingHorizontal: space.base,
      paddingVertical: space.md,
      borderBottomWidth: 1,
      borderBottomColor: colors.borderLight,
    },
    merchantLogo: { width: 48, height: 48, borderRadius: radius.md },
    merchantInfo: { flex: 1 },
    merchantName: { ...typography.label, color: colors.text },
    merchantMeta: { ...typography.caption, color: colors.textSecondary },
    // Product result row
    productRow: {
      flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
      alignItems: 'center',
      gap: space.md,
      paddingHorizontal: space.base,
      paddingVertical: space.md,
      borderBottomWidth: 1,
      borderBottomColor: colors.borderLight,
    },
    productImage: { width: 56, height: 56, borderRadius: radius.md },
    productInfo: { flex: 1 },
    productName: { ...typography.label, color: colors.text },
    productPrice: { ...typography.body2, color: colors.primary, marginTop: 2 },
    addBtn: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
