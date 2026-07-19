import { Dimensions, StyleSheet } from 'react-native';
import type { AppColors } from '@dawwar/theme';
import { radius, shadows, space, typography } from '@dawwar/theme';

const { width } = Dimensions.get('window');

export const createStyles = (colors: AppColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    mapContainer: {
      flex: 1,
    },
    map: {
      ...StyleSheet.absoluteFillObject,
    },
    overlayLayer: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'transparent',
    },
    topOverlay: {
      position: 'absolute',
      top: 50,
      start: space.base,
      end: space.base,
      zIndex: 10,
    },
    bottomOverlay: {
      position: 'absolute',
      bottom: space.lg,
      start: space.xs,
      end: space.xs,
      zIndex: 10,
    },
    orderSlide: {
      width: width - space.base * 2,
      marginHorizontal: space.xs,
    },
    ordersListContent: {
      paddingHorizontal: space.sm,
    },
    markerContainer: {
      padding: space.xs,
      backgroundColor: colors.surface,
      borderRadius: radius.full,
      ...shadows.sm,
    },
    waitingCard: {
      backgroundColor: colors.surface,
      margin: space.sm,
      padding: space.lg,
      borderRadius: radius.lg,
      alignItems: 'center',
      flexDirection: 'row',
      gap: space.md,
      ...shadows.md,
    },
    waitingText: {
      ...typography.h4,
      color: colors.text,
      textAlign: 'auto',
      flex: 1,
    },
    offlineCard: {
      position: 'absolute',
      bottom: 40,
      start: space.base,
      end: space.base,
      backgroundColor: colors.surface,
      padding: space.xl,
      borderRadius: radius.lg,
      alignItems: 'center',
      gap: space.md,
      ...shadows.lg,
    },
    header: {
      paddingHorizontal: space.base,
      paddingTop: space.base,
      paddingBottom: space.sm,
    },
    headerTitle: { ...typography.h2, color: colors.text },
    offlinePlaceholder: {
      flex: 1, alignItems: 'center', justifyContent: 'center',
      padding: space.xl, gap: space.md,
    },
    offlineText: { ...typography.body1, color: colors.textSecondary, textAlign: 'center' },
    listContent: { paddingTop: space.sm, paddingBottom: 24 },
  });
