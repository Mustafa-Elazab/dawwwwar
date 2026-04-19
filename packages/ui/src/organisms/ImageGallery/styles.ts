import { StyleSheet, Dimensions } from 'react-native';
import type { AppColors } from '@dawwar/theme';
import { space, typography } from '@dawwar/theme';

const { width, height } = Dimensions.get('window');

export const createStyles = (colors: AppColors) =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: '#000',
      alignItems: 'center',
      justifyContent: 'center',
    },
    closeBtn: {
      position: 'absolute',
      top: space['2xl'],
      right: space.base,
      zIndex: 10,
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: 'rgba(255,255,255,0.2)',
      alignItems: 'center',
      justifyContent: 'center',
    },
    image: {
      width,
      height: height * 0.7,
    },
    counter: {
      position: 'absolute',
      bottom: space['2xl'],
      alignSelf: 'center',
      ...typography.label,
      color: 'rgba(255,255,255,0.8)',
    },
    dotRow: {
      position: 'absolute',
      bottom: space.xl,
      flexDirection: 'row',
      gap: 6,
      alignSelf: 'center',
    },
    dot: {
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: 'rgba(255,255,255,0.4)',
    },
    dotActive: {
      backgroundColor: '#fff',
      width: 16,
    },
    thumbnail: {
      width: 56,
      height: 56,
      borderRadius: 6,
      marginRight: 6,
      opacity: 0.6,
    },
    thumbnailActive: {
      opacity: 1,
      borderWidth: 2,
      borderColor: '#fff',
    },
    thumbnailRow: {
      position: 'absolute',
      bottom: space['3xl'],
      flexDirection: 'row',
      paddingHorizontal: space.base,
    },
  });
