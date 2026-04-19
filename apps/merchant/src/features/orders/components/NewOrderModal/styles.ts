import { StyleSheet } from 'react-native';
import type { AppColors } from '@dawwar/theme';
import { space, typography, radius } from '@dawwar/theme';

export const createStyles = (colors: AppColors) =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'flex-end',
    },
    sheet: {
      backgroundColor: colors.card,
      borderTopLeftRadius: radius['2xl'],
      borderTopRightRadius: radius['2xl'],
      padding: space.base,
      maxHeight: '85%',
    },
    handle: {
      width: 40, height: 4,
      borderRadius: 2, backgroundColor: colors.border,
      alignSelf: 'center', marginBottom: space.md,
    },
    alertHeader: {
      backgroundColor: colors.primary,
      borderRadius: radius.xl,
      padding: space.lg,
      alignItems: 'center',
      marginBottom: space.md,
    },
    alertTitle: { ...typography.h3, color: '#fff', fontWeight: '800' },
    alertAmount: { ...typography.h2, color: '#fff', fontWeight: '800', marginTop: 4 },
    timerText: { ...typography.body2, color: 'rgba(255,255,255,0.8)', marginTop: 4 },
    prepSection: { marginBottom: space.md },
    prepLabel: { ...typography.label, color: colors.textSecondary, marginBottom: space.sm },
    prepRow: { flexDirection: 'row', gap: space.sm, flexWrap: 'wrap' },
    prepChip: {
      paddingHorizontal: space.md, paddingVertical: space.sm,
      borderRadius: radius.full,
      borderWidth: 1.5, borderColor: colors.border,
    },
    prepChipSelected: { borderColor: colors.primary, backgroundColor: colors.primaryMuted },
    prepChipLabel: { ...typography.label },
    acceptBtn: { marginBottom: space.sm },
    rejectBtn: {},
  });
