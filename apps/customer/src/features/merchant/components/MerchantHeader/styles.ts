import { I18nManager, StyleSheet } from 'react-native';
import type { AppColors } from '@dawwar/theme';
import { typography } from '@dawwar/theme';

export const createStyles = (colors: AppColors, isRTL = I18nManager.isRTL) =>
  StyleSheet.create({
    coverContainer: {
      height: 220,
      width: '100%',
      position: 'relative',
      backgroundColor: colors.surfaceVariant,
    },
    cover: {
      width: '100%',
      height: '100%',
      backgroundColor: colors.surfaceVariant,
    },
    overlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(0,0,0,0.15)',
    },
    gradient: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: 120,
      backgroundColor: 'rgba(0,0,0,0.6)', // Simple solid fade to text, or use gradient if installed
    },
    headerContent: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      padding: 16,
    },
    businessName: {
      ...typography.h2,
      color: '#fff',
      marginBottom: 8,
      textAlign: isRTL ? 'right' : 'left',
      writingDirection: isRTL ? 'rtl' : 'ltr',
    },
    metaRow: {
      flexDirection: isRTL ? 'row-reverse' : 'row',
      alignItems: 'center',
      marginBottom: 12,
      alignSelf: isRTL ? 'flex-end' : 'flex-start',
    },
    ratingRow: {
      flexDirection: isRTL ? 'row-reverse' : 'row',
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.4)',
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 12,
    },
    ratingText: {
      ...typography.label,
      color: '#fff',
      marginStart: 4,
      fontWeight: '700',
    },
    metaText: {
      ...typography.body2,
      color: '#eee',
      marginHorizontal: 4,
    },
    badgeWrapper: {
      alignSelf: isRTL ? 'flex-end' : 'flex-start',
    },
  });
