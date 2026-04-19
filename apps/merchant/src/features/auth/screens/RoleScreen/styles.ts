import { StyleSheet } from 'react-native';
import type { AppColors } from '@dawwar/theme';
import { space, typography, radius, shadows } from '@dawwar/theme';

export const createStyles = (colors: AppColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: space.base,
      paddingTop: space['2xl'],
      paddingBottom: space.xl,
    },
    title: {
      ...typography.h2,
      color: colors.text,
      marginBottom: space.sm,
    },
    subtitle: {
      ...typography.body2,
      color: colors.textSecondary,
      marginBottom: space['2xl'],
    },
    card: {
      borderWidth: 2,
      borderRadius: radius.xl,
      padding: space.base,
      marginBottom: space.md,
      flexDirection: 'row',
      alignItems: 'center',
      gap: space.md,
      borderColor: colors.border,
      backgroundColor: colors.card,
      ...shadows.sm,
    },
    cardSelected: {
      borderColor: colors.primary,
      backgroundColor: colors.primaryMuted,
    },
    iconCircle: {
      width: 52,
      height: 52,
      borderRadius: 26,
      backgroundColor: colors.surfaceVariant,
      alignItems: 'center',
      justifyContent: 'center',
    },
    iconCircleSelected: {
      backgroundColor: colors.primary,
    },
    cardText: { flex: 1 },
    cardTitle: {
      ...typography.h4,
      color: colors.text,
    },
    cardTitleSelected: { color: colors.primary },
    cardSubtitle: {
      ...typography.body2,
      color: colors.textSecondary,
      marginTop: 2,
    },
    spacer: { flex: 1 },
    continueButton: { marginTop: space.xl },
  });
