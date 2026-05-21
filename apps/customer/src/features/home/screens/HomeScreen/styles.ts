import { StyleSheet } from 'react-native';
import type { AppColors } from '@dawwar/theme';
import { space, typography, radius, shadows, layout } from '@dawwar/theme';

export const createStyles = (colors: AppColors) =>
  StyleSheet.create({
    scrollContent: {
      paddingBottom: 140,
      gap: space.xl,
    },

    // ── Header ──────────────────────────────────────
    headerContainer: {
      paddingHorizontal: layout.screenPaddingH,
      paddingTop: space.md,
      paddingBottom: space.lg,
      backgroundColor: colors.background,
      gap: space.sm,
    },
    headerTopRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    headerActions: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: space.xs,
    },
    greetingWrapper: {
      flex: 1,
      alignItems: 'flex-start',
    },
    greetingText: {
      ...typography.h2,
      color: colors.text,
      fontWeight: '800',
      letterSpacing: -0.3,
    },
    greetingSub: {
      ...typography.body2,
      color: colors.textSecondary,
      marginTop: 2,
    },
    bellBtn: {
      width: 44,
      height: 44,
      borderRadius: radius.lg,
      backgroundColor: colors.surface,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: colors.borderLight,
      ...shadows.xs,
    },
    iconBtnGhost: {
      width: 44,
      height: 44,
      borderRadius: radius.lg,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
    },
    badgeDot: {
      position: 'absolute',
      top: 10,
      end: 11,
      width: 9,
      height: 9,
      borderRadius: 4.5,
      backgroundColor: colors.error,
      borderWidth: 1.5,
      borderColor: colors.surface,
    },
    locationBlock: {
      alignSelf: 'flex-start',
      maxWidth: '100%',
      paddingVertical: space.xs,
    },
    deliveringLabel: {
      ...typography.caption,
      color: colors.textTertiary,
      fontWeight: '500',
      marginBottom: 1,
    },
    locationRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: space.xs,
    },
    locationPrimary: {
      ...typography.body2,
      color: colors.text,
      fontWeight: '700',
      flexShrink: 1,
    },

    // ── Search ──────────────────────────────────────
    searchWrapper: {},
    searchTap: {
      height: 50,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#1A1A1A',
      borderRadius: 16,
      paddingHorizontal: space.base,
      gap: space.sm,
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.08)',
    },
    searchPlaceholder: {
      ...typography.body2,
      color: '#606060',
      flex: 1,
      textAlign: 'auto',
    },
    discoveryWrap: {
      flexDirection: 'row',
      backgroundColor: '#1A1A1A',
      borderRadius: 12,
      padding: 4,
      gap: 4,
    },
    discoveryPill: {
      flex: 1,
      borderRadius: 10,
      paddingVertical: 8,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'transparent',
    },
    discoveryPillActive: {
      backgroundColor: '#FFFFFF',
      ...shadows.xs,
    },
    discoveryText: {
      ...typography.caption,
      color: '#A0A0A0',
      fontWeight: '600',
    },
    discoveryTextActive: {
      color: '#1DB954',
      fontWeight: '700',
    },
    chipsRow: {
      paddingTop: space.sm,
      gap: space.sm,
    },
    categoryChip: {
      width: 68,
      height: 72,
      borderRadius: 14,
      backgroundColor: '#1A1A1A',
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.08)',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 4,
    },
    categoryEmoji: {
      fontSize: 24,
      lineHeight: 26,
    },
    categoryLabel: {
      ...typography.caption,
      color: '#F5F5F5',
      fontSize: 11,
      textAlign: 'center',
      paddingHorizontal: 3,
    },

    // ── Hero ───────────────────────────────────────
    heroCard: {
      marginHorizontal: layout.screenPaddingH,
      padding: space.lg,
      borderRadius: radius['2xl'],
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.borderLight,
      ...shadows.sm,
      overflow: 'hidden',
      gap: space.sm,
    },
    heroGlow: {
      position: 'absolute',
      top: -60,
      end: -40,
      width: 160,
      height: 160,
      borderRadius: 80,
      backgroundColor: colors.primary,
      opacity: 0.12,
    },
    heroTitle: {
      ...typography.title,
      color: colors.text,
      fontWeight: '800',
    },
    heroCopy: {
      ...typography.body2,
      color: colors.textSecondary,
    },
    heroButton: {
      alignSelf: 'flex-start',
    },

    // ── Lists ───────────────────────────────────────
    merchantsList: {
      paddingHorizontal: layout.screenPaddingH,
      paddingBottom: space.xs,
    },
    productsGrid: {
      paddingHorizontal: layout.screenPaddingH,
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: space.md,
    },
    productGridItem: {
      width: '47.5%',
    },
    skeletonRow: {
      paddingHorizontal: layout.screenPaddingH,
      flexDirection: 'row',
      gap: space.md,
    },
    sectionBlock: {
      gap: space.md,
    },

    // ── Floating Cart Bar ─────────────────────────
    cartBarWrap: {
      position: 'absolute',
      bottom: 96,
      start: 20,
      end: 20,
    },
    cartBar: {
      flexDirection: 'row',
      backgroundColor: '#1DB954',
      borderRadius: 16,
      height: 52,
      paddingHorizontal: space.base,
      alignItems: 'center',
      justifyContent: 'space-between',
      ...shadows.md,
      shadowColor: '#1DB954',
      shadowOpacity: 0.4,
      shadowRadius: 12,
    },
    cartCountBubble: {
      minWidth: 26,
      height: 26,
      borderRadius: 13,
      backgroundColor: '#0D0D0D',
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 6,
    },
    cartCountText: {
      ...typography.caption,
      color: '#F5F5F5',
      fontWeight: '700',
    },
    cartCta: {
      ...typography.label,
      color: '#0D0D0D',
      fontWeight: '700',
    },
    cartTotal: {
      ...typography.label,
      color: '#0D0D0D',
      fontWeight: '800',
    },
  });
