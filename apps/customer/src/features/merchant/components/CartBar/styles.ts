import { StyleSheet } from 'react-native';
import type { AppColors } from '@dawwar/theme';
import { space, typography, radius, layout } from '@dawwar/theme';

export const createStyles = (colors: AppColors) =>
  StyleSheet.create({
    bar: {
      position: 'absolute',
      bottom: 0,
      start: 0,
      end: 0,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: colors.primary,
      paddingHorizontal: layout.screenPaddingH,
      paddingVertical: space.md,
      borderTopStartRadius: radius.xl,
      borderTopEndRadius: radius.xl,
    },
    leftText: { ...typography.label, color: '#fff' },
    rightText: { ...typography.label, color: '#fff', fontWeight: '700' },
  });
