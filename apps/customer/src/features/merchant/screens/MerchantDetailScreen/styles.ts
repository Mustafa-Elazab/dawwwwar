import { StyleSheet } from 'react-native';
import type { AppColors } from '@dawwar/theme';
import { space, typography, radius, shadows, layout } from '@dawwar/theme';

export const createStyles = (colors: AppColors) =>
  StyleSheet.create({
    headerOverlay: {
      position: 'absolute',
      top: 0,
      start: 0,
      end: 0,
      zIndex: 10,
    },
    headerBackground: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: colors.background,
      borderBottomWidth: 1,
      borderBottomColor: colors.borderLight,
      ...shadows.xs,
    },
    headerContentWrapper: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: layout.screenPaddingH,
    },
    headerButton: {
      width: 40,
      height: 40,
      borderRadius: radius.lg,
      backgroundColor: colors.surface,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.borderLight,
      ...shadows.xs,
    },
    headerButtonPlaceholder: {
      width: 40,
    },
    headerTitle: {
      ...typography.body1,
      fontWeight: '700',
      color: colors.text,
      flex: 1,
      textAlign: 'center',
      marginHorizontal: space.md,
    },
    stickyCategoriesWrapper: {
      position: 'absolute',
      start: 0,
      end: 0,
      height: 58,
      backgroundColor: colors.background,
      zIndex: 5,
      borderBottomWidth: 1,
      borderBottomColor: colors.borderLight,
      justifyContent: 'center',
    },
    categoryChipsContainer: {
      paddingHorizontal: layout.screenPaddingH,
      alignItems: 'center',
      gap: space.sm,
    },
    categoryChip: {
      paddingHorizontal: space.base,
      paddingVertical: space.sm,
      backgroundColor: colors.surface,
      borderRadius: radius.full,
      borderWidth: 1,
      borderColor: colors.borderLight,
      ...shadows.xs,
    },
    categoryChipText: {
      ...typography.caption,
      color: colors.text,
      fontWeight: '600',
    },
    categoryTitleContainer: {
      backgroundColor: colors.background,
      paddingHorizontal: layout.screenPaddingH,
      paddingTop: space.lg,
      paddingBottom: space.sm,
      gap: space.xs,
    },
    categoryTitle: {
      ...typography.title,
      color: colors.text,
      fontWeight: '700',
      alignSelf: 'flex-start',
    },
    categoryDivider: {
      height: 1,
      backgroundColor: colors.borderLight,
      width: 36,
      borderRadius: 1,
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
      padding: layout.screenPaddingH,
      gap: space.lg,
    },
    infoRow: {
      gap: space.xs,
    },
    infoLabel: {
      ...typography.caption,
      color: colors.textTertiary,
      fontWeight: '600',
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    infoValue: {
      ...typography.body1,
      color: colors.text,
    },
    hoursTable: { gap: space.sm },
    hoursRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: space.xs,
      borderBottomWidth: 1,
      borderBottomColor: colors.borderLight,
    },
    reviewsPlaceholder: {
      padding: space['3xl'],
      alignItems: 'center',
    },
    bottomPad: { height: 80 },
  });
