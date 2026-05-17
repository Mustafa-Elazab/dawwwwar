import { StyleSheet } from 'react-native';
import type { AppColors } from '@dawwar/theme';
import { space, typography, radius, shadows } from '@dawwar/theme';

export const createStyles = (colors: AppColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollContent: {
      padding: space.base,
      paddingBottom: 100, // Space for sticky bottom bar
    },
    
    // ── Section Card ────────────────────────────────────
    sectionCard: {
      backgroundColor: colors.card,
      borderRadius: 16, // Radius 16
      padding: 16,      // Padding 16
      marginBottom: space.lg,
      ...shadows.sm,
      borderWidth: 1,
      borderColor: colors.borderLight,
    },
    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: space.sm,
      marginBottom: space.md,
    },
    sectionIconContainer: {
      width: 32,
      height: 32,
      borderRadius: 8,
      backgroundColor: colors.primaryMuted,
      alignItems: 'center',
      justifyContent: 'center',
    },
    sectionTitle: { 
      ...typography.label, 
      color: colors.text,
      fontWeight: '800',
    },
    sectionSubtitle: { 
      ...typography.caption, 
      color: colors.textSecondary,
      marginBottom: space.xs,
    },

    // ── Inputs ──────────────────────────────────────────
    inputContainer: {
      marginBottom: space.md,
    },
    styledInput: {
      height: 48, // 48px height
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1.5,
      borderRadius: radius.md,
      borderColor: colors.border,
      backgroundColor: colors.background,
      paddingHorizontal: space.md,
      gap: space.sm,
    },
    inputIcon: {
      opacity: 0.7,
    },
    inputField: {
      flex: 1,
      ...typography.body2,
      color: colors.text,
      textAlign: 'left',
    },

    mapPickerBtn: {
      height: 48,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1.5,
      borderRadius: radius.md,
      borderColor: colors.primary,
      backgroundColor: colors.surface,
      gap: space.sm,
      marginTop: space.sm,
    },
    mapPickerText: { 
      ...typography.label, 
      color: colors.primary,
      fontWeight: '700',
    },

    textArea: {
      minHeight: 100,
      borderWidth: 1.5,
      borderRadius: radius.md,
      borderColor: colors.border,
      padding: space.md,
      ...typography.body2,
      color: colors.text,
      textAlignVertical: 'top',
      backgroundColor: colors.background,
      textAlign: 'left',
    },

    // ── Components Redesign ─────────────────────────────
    itemsDivider: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: space.sm,
      marginVertical: space.md,
    },
    dividerLine: { flex: 1, height: 1, backgroundColor: colors.borderLight },
    dividerText: { ...typography.overline, color: colors.textDisabled, fontWeight: '700' },

    budgetRow: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1.5, 
      borderRadius: radius.md,
      borderColor: colors.border, 
      overflow: 'hidden',
      height: 48,
      backgroundColor: colors.background,
    },
    budgetInput: {
      flex: 1, 
      ...typography.body1, 
      color: colors.text,
      paddingHorizontal: space.md,
      fontWeight: '700',
      textAlign: 'left',
    },
    budgetSuffix: {
      paddingHorizontal: space.md,
      ...typography.label, 
      color: colors.textSecondary,
      fontWeight: '700',
    },

    paymentRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: space.md,
      paddingVertical: space.sm,
    },
    radio: {
      width: 22, height: 22, borderRadius: 11,
      borderWidth: 2, borderColor: colors.border,
      alignItems: 'center', justifyContent: 'center',
    },
    radioSelected: { borderColor: colors.primary },
    radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.primary },
    
    // ── Sticky Bottom Bar ────────────────────────────────
    stickyFooter: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: colors.surface,
      borderTopWidth: 1,
      borderTopColor: colors.borderLight,
      paddingHorizontal: space.xl,
      paddingVertical: space.md,
      ...shadows.lg,
    },
    summaryRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: space.sm,
      justifyContent: 'center',
      gap: space.md,
    },
    summaryItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    summaryText: {
      ...typography.caption,
      fontWeight: '700',
    },
    submitBtn: {
      height: 52,
      borderRadius: radius.lg,
    },
    errorText: { 
      ...typography.caption, 
      color: colors.error,
      textAlign: 'left',
      marginTop: 4,
    },
  });
