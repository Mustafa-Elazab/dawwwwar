import { StyleSheet } from 'react-native';
import type { AppColors } from '@dawwar/theme';
import { space, typography, radius, shadows } from '@dawwar/theme';

export const createStyles = (colors: AppColors, isRecording?: boolean) =>
  StyleSheet.create({
    container: {
      alignItems: 'center',
      paddingVertical: space.md,
    },
    label: {
      ...typography.caption,
      color: colors.textSecondary,
      marginBottom: space.lg,
      fontWeight: '600',
    },
    
    // ── Record Button ──────────────────────────────────
    recordBtn: {
      width: 72, // 72px circular mic button
      height: 72,
      borderRadius: 36,
      backgroundColor: colors.primary, // primary orange
      alignItems: 'center',
      justifyContent: 'center',
      ...shadows.md,
      elevation: 5,
    },
    pulseRing: {
      position: 'absolute',
      width: 88,
      height: 88,
      borderRadius: 44,
      borderWidth: 2,
      borderColor: colors.primary,
      opacity: 0.3,
    },
    recordText: {
      ...typography.caption,
      color: colors.primary,
      fontWeight: '700',
      marginTop: space.md,
    },
    
    // ── Player ──────────────────────────────────────────
    playerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.background,
      borderRadius: radius.full,
      padding: space.sm,
      width: '100%',
      gap: space.sm,
      borderWidth: 1,
      borderColor: colors.borderLight,
    },
    playBtn: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.surface,
      alignItems: 'center',
      justifyContent: 'center',
      ...shadows.sm,
    },
    waveform: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 3,
      height: 30,
    },
    wavebar: {
      width: 3,
      backgroundColor: colors.primary,
      borderRadius: 1.5,
    },
    clearBtn: {
      padding: space.xs,
    },
  });
