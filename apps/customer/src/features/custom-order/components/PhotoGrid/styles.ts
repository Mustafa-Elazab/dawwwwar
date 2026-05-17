import { StyleSheet } from 'react-native';
import type { AppColors } from '@dawwar/theme';
import { space, typography, radius } from '@dawwar/theme';

export const createStyles = (colors: AppColors) =>
  StyleSheet.create({
    container: {
      paddingVertical: space.sm,
    },
    scrollContent: {
      flexDirection: 'row',
      gap: space.md,
      paddingHorizontal: 2,
    },
    addBtn: {
      width: 80,
      height: 80,
      borderRadius: radius.md,
      borderWidth: 2,
      borderColor: colors.border,
      borderStyle: 'dashed',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.background,
    },
    count: {
      ...typography.overline,
      color: colors.textDisabled,
      fontWeight: '700',
      marginTop: 2,
    },
    photoWrapper: {
      position: 'relative',
      width: 80,
      height: 80,
    },
    image: {
      width: 80,
      height: 80,
      borderRadius: radius.md,
      backgroundColor: colors.background,
    },
    removeBtn: {
      position: 'absolute',
      top: -8,
      right: -8,
      backgroundColor: '#fff',
      borderRadius: 12,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 2,
      elevation: 3,
    },
  });
