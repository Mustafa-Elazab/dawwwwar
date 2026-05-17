import { StyleSheet, Dimensions } from 'react-native';
import type { AppColors } from '@dawwar/theme';
import { space, typography, radius } from '@dawwar/theme';

const { height } = Dimensions.get('window');

export const createStyles = (colors: AppColors) =>
  StyleSheet.create({
    // ── Layout ──────────────────────────────────────────
    container: {
      flex: 1,
      backgroundColor: colors.primary, // Primary background for the top 40%
    },
    illustrationArea: {
      height: height * 0.3,
      alignItems: 'center',
      justifyContent: 'center',
      paddingBottom: space.xl,
    },
    logoText: {
      ...typography.h1,
      fontSize: 64,
      color: '#fff',
      fontWeight: '900',
      
    },
    tagline: {
      ...typography.body2,
      color: 'rgba(255, 255, 255, 0.9)',
      marginTop: space.xs,
      fontWeight: '600',
      letterSpacing: 0.5,
    },

    // ── Form Card ───────────────────────────────────────
    card: {
      flex: 1,
      backgroundColor: colors.card,
      borderTopLeftRadius: 32,
      borderTopRightRadius: 32,
      paddingHorizontal: space.xl,
      paddingTop: space.xl,
      paddingBottom: space.xl,
      // Subtle shadow for the card overlapping the primary background
      shadowColor: '#000',
      shadowOffset: { width: 0, height: -4 },
      shadowOpacity: 0.1,
      shadowRadius: 12,
      elevation: 8,
    },
    
    // ── Form Content ────────────────────────────────────
    formTitle: {
      ...typography.h3,
      color: colors.text,
      marginBottom: space.lg,
      textAlign: 'left',
      fontWeight: '800',
    },
    phoneRow: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1.5,
      borderRadius: radius.lg,
      borderColor: colors.border,
      backgroundColor: colors.background,
      overflow: 'hidden',
      marginBottom: space.md,
      height: 56,
    },
    phoneRowError: {
      borderColor: colors.error,
    },
    countryPrefix: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: space.md,
      borderEndWidth: 1,
      borderColor: colors.border,
      gap: space.sm,
      height: '100%',
    },
    prefixFlag: {
      fontSize: 20,
    },
    prefixCode: {
      ...typography.label,
      color: colors.text,
      fontWeight: '700',
    },
    phoneInput: {
      flex: 1,
      ...typography.body1,
      color: colors.text,
      paddingHorizontal: space.md,
      height: '100%',
      textAlign: 'left',
    },
    errorText: {
      ...typography.caption,
      color: colors.error,
      marginBottom: space.sm,
      textAlign: 'left',
    },

    // ── Terms ────────────────────────────────────────────
    termsRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginBottom: space.xl,
      gap: space.sm,
      paddingHorizontal: 2,
    },
    checkboxContainer: {
      padding: space.xs,
      margin: -space.xs,
    },
    checkbox: {
      width: 24,
      height: 22,
      borderRadius: radius.md,
      borderWidth: 2,
      borderColor: colors.border,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 2,
      flexShrink: 0,
    },
    checkboxChecked: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    termsText: {
      flex: 1,
      ...typography.caption,
      color: colors.textSecondary,
      textAlign: 'left',
      lineHeight: 18,
    },
    termsLink: {
      color: colors.primary,
      fontWeight: '700',
    },

    // ── Bottom ────────────────────────────────────────────
    spacer: { flex: 1 },
    sendButton: { 
      height: 56,
      borderRadius: radius.lg,
      marginBottom: space.md,
    },
    termsHint: {
      ...typography.caption,
      color: colors.error,
      textAlign: 'center',
      marginTop: space.sm,
    },
    hintText: {
      ...typography.caption,
      color: colors.textDisabled,
      textAlign: 'center',
      opacity: 0.8,
    },
  });
