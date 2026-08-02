import { StyleSheet } from 'react-native';
import { radius, spacing } from '@dawwar/theme';

export const createStyles = () =>
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: '#B96E43',
    },
    content: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: spacing[6],
      gap: spacing[6],
    },
    logoWrap: {
      width: 228,
      height: 228,
      alignItems: 'center',
      justifyContent: 'center',
    },
    ringHalo: {
      position: 'absolute',
      width: 210,
      height: 210,
      borderRadius: 105,
      borderWidth: 2,
      borderColor: '#FFF1D6',
      backgroundColor: 'rgba(255, 241, 214, 0.08)',
    },
    logo: {
      width: 218,
      height: 218,
    },
    copy: {
      width: '100%',
      maxWidth: 360,
      alignItems: 'center',
      gap: spacing[3],
    },
    brand: {
      fontSize: 44,
      lineHeight: 52,
      fontWeight: '900',
      textShadowColor: 'rgba(76, 15, 38, 0.28)',
      textShadowOffset: { width: 0, height: 2 },
      textShadowRadius: 12,
    },
    subtitle: {
      lineHeight: 24,
      textShadowColor: 'rgba(76, 15, 38, 0.22)',
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 8,
    },
    warmTextPill: {
      minHeight: 44,
      borderRadius: radius.full,
      borderWidth: 1,
      borderColor: 'rgba(255, 248, 236, 0.48)',
      backgroundColor: 'rgba(255, 248, 236, 0.12)',
      paddingHorizontal: spacing[5],
      paddingVertical: spacing[3],
      alignItems: 'center',
      justifyContent: 'center',
    },
    warmText: {
      lineHeight: 18,
      textShadowColor: 'rgba(76, 15, 38, 0.24)',
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 6,
    },
    loadingDots: {
      minHeight: 24,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing[2],
      paddingTop: spacing[2],
    },
    dot: {
      width: 7,
      height: 7,
      borderRadius: radius.full,
      backgroundColor: '#FFF8EC',
      opacity: 0.85,
    },
    dotMuted: {
      opacity: 0.48,
    },
  });
