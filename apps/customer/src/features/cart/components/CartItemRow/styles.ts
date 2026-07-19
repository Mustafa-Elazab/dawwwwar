import { StyleSheet } from 'react-native';
import type { AppColors } from '@dawwar/theme';
import { space, typography, radius, shadows } from '@dawwar/theme';

export const createStyles = (colors: AppColors) =>
  StyleSheet.create({
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: space.md,
      paddingVertical: space.md,
      backgroundColor: colors.surface,
    },
    image: { 
      width: 80, // 80x80px image
      height: 80, 
      borderRadius: radius.lg,
      backgroundColor: colors.background,
    },
    info: { 
      flex: 1, 
      gap: 2,
      alignItems: 'flex-start',
    },
    name: { 
      ...typography.label, 
      color: colors.text,
      fontWeight: '800', // Bold product name
      textAlign: 'auto',
    },
    merchantName: {
      ...typography.caption,
      color: colors.textSecondary,
      marginBottom: 4,
    },
    price: { 
      ...typography.body2, 
      color: colors.primary, // Primary orange price
      fontWeight: '800',
      textAlign: 'auto',
    },
    stepper: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: space.sm,
      backgroundColor: colors.background,
      borderRadius: radius.full,
      padding: 4,
    },
    stepBtn: {
      width: 32, // Circular buttons
      height: 32,
      borderRadius: 16,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.surface,
      ...shadows.sm,
    },
    count: {
      ...typography.label,
      color: colors.text,
      minWidth: 28,
      textAlign: 'center',
      fontWeight: '700',
    },
  });
