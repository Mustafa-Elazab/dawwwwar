import { StyleSheet, I18nManager } from 'react-native';
import type { AppColors } from '@dawwar/theme';
import { space, typography, radius, shadows } from '@dawwar/theme';

export const createStyles = (colors: AppColors) =>
  StyleSheet.create({
    card: {
      backgroundColor: colors.card,
      borderRadius: radius.xl,
      marginHorizontal: space.base,
      marginBottom: space.md,
      overflow: 'hidden',
      ...shadows.md,
    },
    header: {
      flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: space.base,
      borderBottomWidth: 1,
      borderBottomColor: colors.borderLight,
    },
    orderNum: { ...typography.label, color: colors.text },
    body: { padding: space.base, gap: space.md },
    sectionLabel: { ...typography.caption, color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: 0.8 },
    addressText: { ...typography.body1, color: colors.text },
    descriptionText: { ...typography.body1, color: colors.text, lineHeight: 22 },
    photoGrid: { flexDirection: 'row', gap: space.sm, flexWrap: 'wrap' },
    photoThumb: { width: 70, height: 70, borderRadius: radius.md },
    customWarning: {
      flexDirection: 'row', alignItems: 'flex-start', gap: space.sm,
      backgroundColor: colors.warningBg, borderRadius: radius.md,
      padding: space.md,
    },
    warningText: { ...typography.caption, color: colors.warning, flex: 1, lineHeight: 18 },
    paymentBadge: {
      flexDirection: 'row', alignItems: 'center', gap: space.sm,
    },
    actions: {
      flexDirection: 'row', gap: space.sm,
      padding: space.base,
      borderTopWidth: 1, borderTopColor: colors.borderLight,
    },
    acceptBtn: { flex: 2 },
    declineBtn: { flex: 1 },
  });
