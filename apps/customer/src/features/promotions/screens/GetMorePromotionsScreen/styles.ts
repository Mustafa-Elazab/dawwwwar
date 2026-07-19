import { StyleSheet } from 'react-native';
import type { AppColors } from '@dawwar/theme';
import { radius, space, typography } from '@dawwar/theme';

export const createStyles = (colors: AppColors, _isRTL: boolean) =>
  StyleSheet.create({
    content: {
      flexGrow: 1,
      paddingHorizontal: space.xl,
      paddingTop: space.sm,
      paddingBottom: space['4xl'],
      backgroundColor: colors.background,
      gap: space.md,
    },
    header: {
      minHeight: 76,
      paddingHorizontal: space.xl,
      paddingTop: space.md,
      paddingBottom: space.sm,
      backgroundColor: colors.background,
      flexDirection: 'row',
      alignItems: 'center',
    },
    headerAction: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: colors.surface,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: colors.shadow,
      shadowOpacity: 1,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 4 },
      elevation: 2,
    },
    headerActionGhost: {
      opacity: 0,
    },
    headerTitleWrap: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    headerTitle: {
      ...typography.h4,
      color: colors.text,
      fontWeight: '800',
      textAlign: 'center',
    },
    earnRow: {
      minHeight: 64,
      borderRadius: radius.md,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surface,
      paddingHorizontal: space.base,
      flexDirection: 'row',
      alignItems: 'center',
      gap: space.md,
    },
    earnIcon: {
      width: 38,
      alignItems: 'center',
      justifyContent: 'center',
    },
    earnTitle: {
      ...typography.body1,
      flex: 1,
      color: colors.text,
      fontWeight: '800',
      textAlign: 'auto',
    },
  });
