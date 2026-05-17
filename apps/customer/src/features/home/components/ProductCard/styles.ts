import { StyleSheet } from 'react-native';
import type { AppColors } from '@dawwar/theme';
import { space, typography, radius, shadows } from '@dawwar/theme';

export const createStyles = (colors: AppColors) =>
  StyleSheet.create({
    card: {
      flex: 1,
      borderRadius: radius['2xl'], 
      backgroundColor: colors.surface,
      overflow: 'hidden',
      ...shadows.md,
      borderWidth: 1,
      borderColor: colors.border,
      // Ensure layout direction handles RTL automatically
      flexDirection: 'column',
    },
    imageContainer: {
      width: '100%',
      height: 140,
      position: 'relative',
    },
    image: { 
      width: '100%', 
      height: '100%',
      backgroundColor: colors.background,
    },
    badges: {
      position: 'absolute',
      top: space.xs,
      // Use logical positioning for RTL
      left: space.xs,
      right: undefined,
      flexDirection: 'row',
      gap: space.xs,
    },
    badge: {
      paddingHorizontal: space.sm,
      paddingVertical: 2,
      borderRadius: radius.sm,
    },
    badgeDiscount: { backgroundColor: colors.error },
    badgePopular: { backgroundColor: colors.warning },
    badgeText: {
      ...typography.overline,
      color: '#fff',
      fontWeight: '800',
      textTransform: 'uppercase',
    },
    body: { 
      padding: space.md,
      flex: 1,
      justifyContent: 'space-between',
      // Text alignment fix
      alignItems: 'stretch',
    },
    name: {
      ...typography.body2,
      color: colors.text,
      fontWeight: '700',
      marginBottom: space.xs,
      lineHeight: 20,
      textAlign: 'left',
    },
    merchantName: {
      ...typography.caption,
      color: colors.textSecondary,
      marginBottom: space.sm,
      textAlign: 'left',
    },
    footer: {
      flexDirection: 'row', // Will flip automatically in RTL
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      marginTop: space.sm,
    },
    priceContainer: {
      flex: 1,
      alignItems: 'flex-start',
    },
    price: {
      ...typography.h3,
      fontSize: 16,
      color: colors.primary,
      fontWeight: '800',
    },
    comparePrice: {
      ...typography.caption,
      color: colors.textDisabled,
      textDecorationLine: 'line-through',
      marginTop: -2,
    },
    addBtn: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      ...shadows.sm,
      shadowColor: colors.primary,
    },
    unavailable: { opacity: 0.5 },
  });
