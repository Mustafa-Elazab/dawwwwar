import { StyleSheet } from 'react-native';
import type { AppColors } from '@dawwar/theme';
import { space, typography } from '@dawwar/theme';

export const createStyles = (colors: AppColors) =>
  StyleSheet.create({
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: space.base,
      paddingTop: space.base,
      paddingBottom: space.md,
    },
    greeting: {
      ...typography.h3,
      color: colors.text,
    },
    locationRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      marginTop: 2,
    },
    locationText: {
      ...typography.caption,
      color: colors.textSecondary,
    },
    bellBtn: { padding: space.sm },
    searchWrapper: {
      paddingHorizontal: space.base,
      marginBottom: space.lg,
    },
    searchTap: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 12,
      paddingHorizontal: space.md,
      paddingVertical: space.md,
      gap: space.sm,
    },
    searchPlaceholder: {
      ...typography.body1,
      color: colors.placeholder,
    },
    merchantsList: {
      paddingLeft: space.base,
      marginBottom: space.lg,
    },
    productsGrid: {
      paddingHorizontal: space.base,
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: space.md,
      marginBottom: 100,
    },
    productGridItem: {
      width: '47.5%',
    },
    skeletonRow: {
      paddingHorizontal: space.base,
      flexDirection: 'row',
      gap: space.md,
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
  });
