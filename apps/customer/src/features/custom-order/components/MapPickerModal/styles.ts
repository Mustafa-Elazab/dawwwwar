import { I18nManager, StyleSheet } from 'react-native';
import type { AppColors } from '@dawwar/theme';
import { space, typography, radius, shadows } from '@dawwar/theme';

export const createStyles = (colors: AppColors, isRTL = I18nManager.isRTL) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: space.base,
      paddingBottom: space.md,
      backgroundColor: colors.background,
    },
    backButton: {
      width: 42,
      height: 42,
      borderRadius: 21,
      backgroundColor: colors.surface,
      alignItems: 'center',
      justifyContent: 'center',
      ...shadows.sm,
    },
    backIcon: {
      transform: [{ scaleX: isRTL ? -1 : 1 }],
    },
    headerTitle: {
      ...typography.h4,
      flex: 1,
      color: colors.text,
      textAlign: 'center',
    },
    headerSpacer: {
      width: 42,
    },
    mapWrap: {
      flex: 1,
      position: 'relative',
      overflow: 'hidden',
      backgroundColor: colors.surface,
    },
    map: {
      ...StyleSheet.absoluteFillObject,
    },
    centerPin: {
      ...StyleSheet.absoluteFillObject,
      alignItems: 'center',
      justifyContent: 'center',
      paddingBottom: 44,
    },
    footer: {
      backgroundColor: colors.background,
      paddingHorizontal: space.base,
      paddingTop: space.sm,
      borderTopStartRadius: radius.xl,
      borderTopEndRadius: radius.xl,
      ...shadows.lg,
    },
    handle: {
      alignSelf: 'center',
      width: 54,
      height: 5,
      borderRadius: radius.full,
      backgroundColor: colors.border,
      marginBottom: space.md,
    },
    footerTitle: {
      ...typography.h4,
      color: colors.text,
      textAlign: 'center',
      marginBottom: space.md,
    },
    addressRow: {
      minHeight: 58,
      flexDirection: 'row',
      alignItems: 'center',
      gap: space.sm,
      borderRadius: radius.md,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surface,
      paddingHorizontal: space.md,
      marginBottom: space.md,
    },
    addressTextWrap: {
      flex: 1,
      alignItems: 'flex-start',
    },
    addressText: {
      ...typography.body2,
      color: colors.text,
      fontWeight: '700',
      textAlign: 'auto',
      writingDirection: isRTL ? 'rtl' : 'ltr',
    },
    confirmButton: {
      height: 54,
      borderRadius: radius.lg,
    },
  });
