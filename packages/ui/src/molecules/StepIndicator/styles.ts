import { StyleSheet } from 'react-native';
import type { AppColors } from '@dawwar/theme';
import { space, radius, typography } from '@dawwar/theme';

export const createStyles = (colors: AppColors) =>
  StyleSheet.create({
    container: { paddingHorizontal: space.base, paddingVertical: space.md },
    row: { flexDirection: 'row', alignItems: 'center' },
    stepContainer: { alignItems: 'center', flex: 1 },
    circle: {
      width: 28,
      height: 28,
      borderRadius: radius.full,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 2,
    },
    circleDone: { backgroundColor: colors.primary, borderColor: colors.primary },
    circleCurrent: { backgroundColor: 'transparent', borderColor: colors.primary },
    circlePending: { backgroundColor: 'transparent', borderColor: colors.border },
    circleText: { ...typography.caption, fontWeight: '700', color: '#fff' },
    circleTextPending: { ...typography.caption, fontWeight: '700', color: colors.textDisabled },
    line: { flex: 1, height: 2, backgroundColor: colors.border },
    lineDone: { backgroundColor: colors.primary },
    label: {
      ...typography.caption,
      color: colors.textSecondary,
      marginTop: space[1],
      textAlign: 'center',
    },
    labelCurrent: { color: colors.primary, fontWeight: '600' },
    labelDone: { color: colors.success },
  });
