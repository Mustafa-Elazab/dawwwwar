import { StyleSheet, I18nManager } from 'react-native';
import type { AppColors } from '@dawwar/theme';
import { space, typography, radius, shadows } from '@dawwar/theme';

export const createStyles = (colors: AppColors, isRTL = I18nManager.isRTL) =>
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: colors.background,
    },
    categorySpacer: {
      height: 60,
    },
    loadingContainer: {
      flex: 1,
      backgroundColor: colors.background,
    },
    loadingContent: {
      padding: space.base,
      gap: space.md,
    },
    tabScroll: {
      flex: 1,
      backgroundColor: colors.background,
    },
    emptyProducts: {
      padding: space['4xl'] + space.base,
      alignItems: 'center',
    },
    headerOverlay: {
      position: 'absolute',
      top: 0,
      start: 0,
      end: 0,
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
      writingDirection: isRTL ? 'rtl' : 'ltr',
      marginHorizontal: space.md,
    },
    stickyCategoriesWrapper: {
      position: 'absolute',
      start: 0,
      end: 0,
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
      borderWidth: 1,
      borderColor: colors.surface,
      borderRadius: radius.full,
      ...shadows.sm,
      shadowColor: '#000',
      elevation: 2,
    },
    categoryChipSelected: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    categoryChipText: {
      ...typography.label,
      color: colors.text,
      fontWeight: '600',
    },
    categoryChipTextSelected: {
      color: colors.primaryText,
    },
    categoryTitleContainer: {
      backgroundColor: colors.background,
      paddingHorizontal: space.base,
      paddingVertical: space.sm,
    },
    categoryTitle: {
      alignSelf: isRTL ? 'flex-end' : 'flex-start',
      textAlign: 'auto',
      writingDirection: isRTL ? 'rtl' : 'ltr',
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
      alignItems: isRTL ? 'flex-end' : 'flex-start',
    },
    infoLabel: {
      ...typography.label,
      color: colors.textSecondary,
      textAlign: 'auto',
      writingDirection: isRTL ? 'rtl' : 'ltr',
    },
    infoValue: {
      ...typography.body1,
      color: colors.text,
      textAlign: 'auto',
      writingDirection: isRTL ? 'rtl' : 'ltr',
    },
    hoursTable: { gap: space.sm },
    hoursRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
    },
    reviewsPlaceholder: {
      padding: space.xl,
      alignItems: 'center',
    },
    bottomPad: { height: 80 },
  });
