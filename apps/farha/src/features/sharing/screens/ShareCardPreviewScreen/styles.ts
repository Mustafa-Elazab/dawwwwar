import { StyleSheet } from 'react-native';
import type { AppColors } from '@dawwar/theme';
import { radius, spacing } from '@dawwar/theme';
import { createPhase1ScreenStyles } from '../../../planner/utils/styles';

export const createStyles = (colors: AppColors) =>
  StyleSheet.create({
    ...createPhase1ScreenStyles(colors),
    previewCard: {
      minHeight: 390,
      borderRadius: radius.xl,
      overflow: 'hidden',
      backgroundColor: colors.card,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.border,
      shadowColor: '#000',
      shadowOpacity: 0.14,
      shadowRadius: 18,
      shadowOffset: { width: 0, height: 10 },
      elevation: 8,
    },
    previewCardFallback: {
      padding: spacing[5],
    },
    previewImage: {
      borderRadius: radius.xl,
    },
    previewOverlay: {
      flex: 1,
      padding: spacing[5],
      backgroundColor: 'rgba(0, 0, 0, 0.38)',
    },
    previewContent: {
      flex: 1,
      justifyContent: 'space-between',
      gap: spacing[5],
    },
    previewTop: {
      gap: spacing[2],
    },
    previewTitle: {
      fontSize: 34,
      lineHeight: 40,
      fontWeight: '900',
    },
    previewMetrics: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing[3],
    },
    previewMetric: {
      minWidth: '45%',
      flexGrow: 1,
      borderRadius: radius.lg,
      padding: spacing[3],
      gap: spacing[1],
    },
    previewFooter: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: spacing[3],
    },
    disabledHint: {
      opacity: 0.78,
    },
  });
