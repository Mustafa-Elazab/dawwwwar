import { Dimensions, I18nManager, StyleSheet } from 'react-native';
import type { AppColors } from '@dawwar/theme';
import { radius, shadows, space, typography } from '@dawwar/theme';

const { height: screenHeight } = Dimensions.get('window');
const mapHeight = Math.round(screenHeight * 0.52);

export const createStyles = (colors: AppColors, topInset: number, bottomInset: number) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingTop: topInset + space.sm,
      paddingHorizontal: space.base,
      paddingBottom: space.md,
      backgroundColor: colors.background,
    },
    backButton: {
      width: 40,
      height: 40,
      borderRadius: radius.full,
      backgroundColor: colors.surface,
      alignItems: 'center',
      justifyContent: 'center',
      ...shadows.sm,
    },
    backIcon: {
      transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }],
    },
    headerTitle: {
      ...typography.body1,
      flex: 1,
      color: colors.text,
      fontWeight: '900',
      textAlign: 'center',
      writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr',
    },
    headerSpacer: {
      width: 40,
    },
    mapContainer: {
      height: mapHeight,
      position: 'relative',
      overflow: 'hidden',
      backgroundColor: colors.surfaceVariant,
    },
    map: {
      ...StyleSheet.absoluteFillObject,
    },
    centerPinContainer: {
      position: 'absolute',
      top: '50%',
      start: '50%',
      transform: [{ translateX: I18nManager.isRTL ? 30 : -30 }],
      marginTop: -42,
      zIndex: 4,
      alignItems: 'center',
    },
    avatarPin: {
      width: 60,
      height: 60,
      borderRadius: radius.full,
      backgroundColor: colors.warning,
      borderWidth: 4,
      borderColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      ...shadows.md,
    },
    pinTail: {
      width: 14,
      height: 14,
      borderRadius: 7,
      marginTop: -8,
      backgroundColor: colors.primary,
      transform: [{ rotate: '45deg' }],
    },
    gpsButton: {
      position: 'absolute',
      top: space.base,
      start: space.base,
      width: 48,
      height: 48,
      borderRadius: radius.full,
      backgroundColor: colors.surface,
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 5,
      ...shadows.md,
    },
    mapHint: {
      position: 'absolute',
      bottom: space.md,
      alignSelf: 'center',
      minHeight: 34,
      borderRadius: radius.full,
      backgroundColor: colors.surface,
      paddingHorizontal: space.base,
      justifyContent: 'center',
      ...shadows.sm,
    },
    mapHintText: {
      ...typography.caption,
      color: colors.textSecondary,
      textAlign: 'center',
      writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr',
    },
    content: {
      paddingHorizontal: space.base,
      paddingTop: space.lg,
      paddingBottom: bottomInset + space.base,
      gap: space.md,
    },
    sectionTitle: {
      ...typography.h4,
      color: colors.text,
      fontWeight: '900',
      textAlign: 'center',
      writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr',
    },
    labelInput: {
      minHeight: 54,
      borderRadius: radius.md,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surfaceVariant,
      paddingHorizontal: space.base,
      color: colors.text,
      ...typography.body1,
      textAlign: 'auto',
      writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr',
    },
    errorText: {
      ...typography.caption,
      color: colors.error,
      textAlign: 'auto',
      writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr',
    },
    saveButton: {
      height: 56,
      borderRadius: radius.lg,
      marginTop: space.sm,
    },
  });
