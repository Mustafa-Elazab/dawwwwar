import { StyleSheet } from 'react-native';
import type { AppColors } from '@dawwar/theme';
import { space, typography, radius, shadows } from '@dawwar/theme';

export const createStyles = (colors: AppColors) =>
  StyleSheet.create({
    overlay: { flex: 1, backgroundColor: colors.background },
    
    // ── Floating Header ─────────────────────────────────
    mapHeader: {
      position: 'absolute',
      left: 0,
      right: 0,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: space.base,
      paddingVertical: space.md,
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      zIndex: 10,
      ...shadows.md,
    },
    mapBackBtn: {
      padding: space.xs,
    },
    mapTitle: { 
      ...typography.h4, 
      color: colors.text, 
      flex: 1, 
      textAlign: 'center',
      marginRight: 32, // Offset for back button to center text
    },

    map: { flex: 1 },

    // ── Fixed Center Pin ────────────────────────────────
    centerPin: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      marginTop: -40,   // offset for pin height
      marginLeft: -20,  // offset for pin width/2
      zIndex: 5,
      alignItems: 'center',
      justifyContent: 'center',
    },

    hint: {
      position: 'absolute', 
      bottom: 120, 
      alignSelf: 'center',
      backgroundColor: colors.card, 
      paddingHorizontal: space.md,
      paddingVertical: space.sm, 
      borderRadius: radius.full,
      ...shadows.md,
      zIndex: 5,
    },
    hintText: { ...typography.caption, color: colors.textSecondary },

    // ── Bottom Action ───────────────────────────────────
    bottomContainer: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: colors.surface,
      padding: space.base,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      ...shadows.lg,
      zIndex: 10,
    },
    addressPreview: {
      marginBottom: space.md,
    },
    addressText: { 
      ...typography.body2, 
      color: colors.text,
      fontWeight: '600',
      textAlign: 'left',
    },
    confirmBtn: {
      height: 52,
      borderRadius: radius.lg,
    },
  });
