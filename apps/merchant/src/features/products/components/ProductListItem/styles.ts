import { StyleSheet, I18nManager } from 'react-native';
import type { AppColors } from '@dawwar/theme';
import { space, typography, radius } from '@dawwar/theme';

export const createStyles = (colors: AppColors) =>
  StyleSheet.create({
    row: {
      flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
      alignItems: 'center',
      padding: space.md,
      gap: space.md,
      backgroundColor: colors.card,
      borderBottomWidth: 1,
      borderBottomColor: colors.borderLight,
    },
    image: { width: 60, height: 60, borderRadius: radius.md },
    info: { flex: 1, gap: 3 },
    name: { ...typography.label, color: colors.text },
    price: { ...typography.label, color: colors.primary },
    unavailable: { opacity: 0.5 },
  });
