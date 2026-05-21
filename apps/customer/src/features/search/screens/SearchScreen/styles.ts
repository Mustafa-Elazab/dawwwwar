import { StyleSheet } from 'react-native';
import type { AppColors } from '@dawwar/theme';
import { space, typography, radius, layout } from '@dawwar/theme';

export const createStyles = (colors: AppColors) =>
  StyleSheet.create({
    searchRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: space.sm,
      padding: space.sm,
      borderBottomWidth: 1,
      borderBottomColor: colors.borderLight,
    },
    backBtn: {
      padding: space.sm,
      flexShrink: 0,
    },
    searchBarWrapper: { flex: 1 },
    sectionHeader: {
      ...typography.overline,
      color: colors.textTertiary,
      paddingHorizontal: layout.screenPaddingH,
      paddingTop: space.lg,
      paddingBottom: space.sm,
      backgroundColor: colors.background,
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
      textAlign: 'center',
    },
    emptySubText: {
      ...typography.body2,
      color: colors.textDisabled,
      textAlign: 'center',
    },
    // Category chip row
    categoryRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: space.sm,
      paddingHorizontal: layout.screenPaddingH,
      paddingVertical: space.sm,
    },
    categoryChip: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: space.xs,
      paddingHorizontal: space.md,
      paddingVertical: space.sm,
      backgroundColor: colors.primaryLight,
      borderRadius: radius.full,
    },
    categoryEmoji: { fontSize: 15 },
    categoryLabel: {
      ...typography.caption,
      color: colors.primary,
      fontWeight: '600',
    },
    // Merchant result row
    merchantRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: space.md,
      paddingHorizontal: layout.screenPaddingH,
      paddingVertical: space.md,
      borderBottomWidth: 1,
      borderBottomColor: colors.borderLight,
    },
    merchantLogo: {
      width: 48,
      height: 48,
      borderRadius: radius.lg,
      backgroundColor: colors.surfaceVariant,
    },
    merchantInfo: {
      flex: 1,
      alignItems: 'flex-start',
    },
    merchantName: {
      ...typography.body1,
      color: colors.text,
      fontWeight: '600',
    },
    merchantMeta: {
      ...typography.caption,
      color: colors.textSecondary,
      marginTop: 1,
    },
    searchContainer: {
      padding: layout.screenPaddingH,
      backgroundColor: colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: colors.borderLight,
    },
    searchBar: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.surfaceVariant,
      borderRadius: radius.xl,
      paddingHorizontal: space.md,
      height: 44,
      gap: space.sm,
    },
    input: {
      flex: 1,
      ...typography.body2,
      color: colors.text,
      paddingVertical: 0,
    },
    // Product result row
    productRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: space.md,
      paddingHorizontal: layout.screenPaddingH,
      paddingVertical: space.md,
      borderBottomWidth: 1,
      borderBottomColor: colors.borderLight,
    },
    productImage: {
      width: 56,
      height: 56,
      borderRadius: radius.lg,
      backgroundColor: colors.surfaceVariant,
    },
    productInfo: {
      flex: 1,
      alignItems: 'flex-start',
    },
    productName: {
      ...typography.body1,
      color: colors.text,
      fontWeight: '600',
    },
    productPrice: {
      ...typography.caption,
      color: colors.primary,
      fontWeight: '700',
      marginTop: 2,
    },
    addBtn: {
      width: 34,
      height: 34,
      borderRadius: 17,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
