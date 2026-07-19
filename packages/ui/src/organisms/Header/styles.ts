import { I18nManager, StyleSheet } from 'react-native';
import { AppColors } from '@dawwar/theme';

export const createStyles = (colors: AppColors) =>
  StyleSheet.create({
    root: {
      paddingHorizontal: 16,
      paddingTop: 12,
      paddingBottom: 16,
      backgroundColor: colors.background,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    rootTransparent: {
      backgroundColor: 'transparent',
      borderBottomWidth: 0,
    },
    actionsRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 12,
    },
    sideContainer: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    spacer: {
      flex: 1,
    },
    actionBtn: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: colors.surface,
      alignItems: 'center',
      justifyContent: 'center',
    },
    actionBtnTransparent: {
      backgroundColor: 'rgba(0,0,0,0.05)',
    },
    titleContainer: {
      alignItems: 'flex-start',
      justifyContent: 'center',
      paddingHorizontal: 4,
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      color: colors.text,
      lineHeight: 34,
      textAlign: 'auto',
      writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr',
    },
    subtitle: {
      fontSize: 14,
      color: colors.textSecondary,
      marginTop: 4,
      textAlign: 'auto',
      writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr',
      lineHeight: 20,
    },
  });
