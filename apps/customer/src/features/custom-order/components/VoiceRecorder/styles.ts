import { StyleSheet } from 'react-native';
import type { AppColors } from '@dawwar/theme';
import { space, typography, radius } from '@dawwar/theme';

export const createStyles = (colors: AppColors, isRecording: boolean) =>
  StyleSheet.create({
    container: {
      borderWidth: 1.5,
      borderRadius: radius.xl,
      borderColor: isRecording ? colors.error : colors.border,
      padding: space.md,
      gap: space.sm,
    },
    label: { ...typography.label, color: colors.textSecondary },
    recordBtn: {
      flexDirection: 'row', alignItems: 'center', gap: space.sm,
      backgroundColor: isRecording ? colors.errorBg : colors.surfaceVariant,
      borderRadius: radius.full, paddingHorizontal: space.lg, paddingVertical: space.md,
      alignSelf: 'flex-start',
    },
    recordText: {
      ...typography.label,
      color: isRecording ? colors.error : colors.text,
    },
    playerRow: {
      flexDirection: 'row', alignItems: 'center', gap: space.md,
    },
    playBtn: {
      width: 40, height: 40, borderRadius: 20,
      backgroundColor: colors.primaryMuted,
      alignItems: 'center', justifyContent: 'center',
    },
    duration: { ...typography.body2, color: colors.textSecondary },
    clearBtn: { padding: space.sm },
    waveform: {
      flex: 1, height: 32,
      flexDirection: 'row', alignItems: 'center', gap: 2,
    },
    wavebar: {
      width: 3, backgroundColor: colors.primary,
      borderRadius: 2,
    },
  });
