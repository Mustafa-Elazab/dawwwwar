import { StyleSheet } from 'react-native';
import type { AppColors } from '@dawwar/theme';
import { space, typography, radius, shadows } from '@dawwar/theme';

export const createStyles = (colors: AppColors) =>
  StyleSheet.create({
    card: {
      flex: 1,
      borderRadius: radius.xl,
      backgroundColor: colors.surface,
      overflow: 'hidden',
      ...shadows.sm,
      borderWidth: 1,
      borderColor: colors.borderLight,
      flexDirection: 'column',
    },
    imageContainer: {
      width: '100%',
      height: 130,
      position: 'relative',
    },
    image: {
      width: '100%',
      height: '100%',
      backgroundColor: colors.surfaceVariant,
    },
    badges: {
      position: 'absolute',
      top: space.sm,
      start: space.sm,
      flexDirection: 'row',
      gap: space.xs,
    },
    badge: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 3,
      paddingHorizontal: space.sm,
      paddingVertical: 3,
      borderRadius: radius.full,
    },
    badgeDiscount: { backgroundColor: colors.error },
    badgePopular: { backgroundColor: colors.warning },
    badgeText: {
      fontSize: 10,
      color: '#fff',
      fontWeight: '800',
      letterSpacing: 0.3,
    },
    body: {
      padding: space.md,
      flex: 1,
      justifyContent: 'space-between',
      alignItems: 'stretch',
      gap: space.sm,
    },
    name: {
      ...typography.body2,
      color: colors.text,
      fontWeight: '600',
      lineHeight: 19,
    },
    merchantName: {
      ...typography.caption,
      color: colors.textTertiary,
      marginTop: 2,
    },
    footer: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
    },
    priceContainer: {
      flex: 1,
      alignItems: 'flex-start',
      gap: 1,
    },
    price: {
      ...typography.body1,
      fontSize: 15,
      color: colors.primary,
      fontWeight: '800',
    },
    comparePrice: {
      ...typography.caption,
      fontSize: 11,
      color: colors.textDisabled,
      textDecorationLine: 'line-through',
    },
    addBtn: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      ...shadows.xs,
      shadowColor: colors.primary,
    },
    unavailable: { opacity: 0.45 },
  });
