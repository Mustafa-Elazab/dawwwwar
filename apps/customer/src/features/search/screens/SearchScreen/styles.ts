import { StyleSheet } from 'react-native';
import type { AppColors } from '@dawwar/theme';
import { space, typography, radius } from '@dawwar/theme';

export const createStyles = (colors: AppColors) =>
  StyleSheet.create({
    searchRow: {
      flexDirection: 'row',
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
      textAlign: 'auto',
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
      flexDirection: 'row',
      alignItems: 'center',
      gap: space.md,
      paddingHorizontal: space.base,
      paddingVertical: space.md,
      borderBottomWidth: 1,
      borderBottomColor: colors.borderLight,
    },
    merchantLogo: { width: 48, height: 48, borderRadius: radius.md },
    merchantInfo: { 
      flex: 1,
      alignItems: 'stretch',
    },
    merchantName: { 
      ...typography.label, 
      color: colors.text,
      textAlign: 'auto',
    },
    merchantMeta: { 
      ...typography.caption, 
      color: colors.textSecondary,
      textAlign: 'auto',
    },
    searchContainer: {
      padding: space.base,
      backgroundColor: colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    searchBar: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.surfaceVariant,
      borderRadius: radius.md,
      paddingHorizontal: space.md,
      height: 44,
      gap: space.sm,
    },
    input: {
      flex: 1,
      ...typography.body2,
      color: colors.text,
      paddingVertical: 0,
      textAlign: 'auto',
    },
    // Product result row
    productRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: space.md,
      paddingHorizontal: space.base,
      paddingVertical: space.md,
      borderBottomWidth: 1,
      borderBottomColor: colors.borderLight,
    },
    productImage: { width: 56, height: 56, borderRadius: radius.md },
    productInfo: { 
      flex: 1,
      alignItems: 'stretch',
    },
    productName: { 
      ...typography.label, 
      color: colors.text,
      textAlign: 'auto',
    },
    productPrice: { 
      ...typography.body2, 
      color: colors.primary, 
      marginTop: 2,
      textAlign: 'auto',
    },
    addBtn: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
