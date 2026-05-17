import { StyleSheet, I18nManager } from 'react-native';
import type { AppColors } from '@dawwar/theme';
import { space, typography, radius, shadows } from '@dawwar/theme';

export const createStyles = (colors: AppColors) =>
  StyleSheet.create({
    headerOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 10,
    },
    headerBackground: {
      ...StyleSheet.absoluteFillObject,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 3,
      elevation: 3,
    },
    headerContentWrapper: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: space.base,
    },
    headerButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.surface,
      justifyContent: 'center',
      alignItems: 'center',
      ...shadows.sm,
      shadowColor: '#000',
      elevation: 3,
    },
    headerButtonPlaceholder: {
      width: 40,
    },
    headerTitle: {
      ...typography.h3,
      color: colors.text,
      flex: 1,
      textAlign: 'center',
      marginHorizontal: space.md,
    },
    stickyCategoriesWrapper: {
      position: 'absolute',
      left: 0,
      right: 0,
      height: 60,
      backgroundColor: colors.background,
      zIndex: 5,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 3,
      elevation: 2,
    },
    categoryChipsContainer: {
      paddingHorizontal: space.base,
      alignItems: 'center',
      gap: space.sm,
    },
    categoryChip: {
      paddingHorizontal: space.md,
      paddingVertical: space.sm,
      backgroundColor: colors.surface,
      borderRadius: radius.full,
      ...shadows.sm,
      shadowColor: '#000',
      elevation: 2,
    },
    categoryChipText: {
      ...typography.label,
      color: colors.text,
      fontWeight: '600',
    },
    categoryTitleContainer: {
      backgroundColor: colors.background,
      paddingHorizontal: space.base,
      paddingVertical: space.sm,
    },
    categoryTitle: {
      alignSelf: 'flex-start',
    },
    productGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      paddingHorizontal: space.xs,
    },
    productGridItem: {
      width: '50%',
      padding: space.xs,
    },
    infoTab: {
      padding: space.base,
      gap: space.md,
    },
    infoRow: {
      gap: space.sm,
    },
    infoLabel: {
      ...typography.label,
      color: colors.textSecondary,
    },
    infoValue: {
      ...typography.body1,
      color: colors.text,
    },
    hoursTable: { gap: space.sm },
    hoursRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    reviewsPlaceholder: {
      padding: space.xl,
      alignItems: 'center',
    },
    bottomPad: { height: 80 },
  });
