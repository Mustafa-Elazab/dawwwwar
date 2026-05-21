import { StyleSheet } from 'react-native';
import { AppColors, space, layout } from '@dawwar/theme';

export const createStyles = (colors: AppColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: layout.screenPaddingH,
      paddingTop: space.lg,
      paddingBottom: space.xl,
      backgroundColor: colors.background,
    },
    form: {
      flex: 1,
      marginTop: space.xl,
      gap: space.md,
    },
    avatarWrap: {
      width: 82,
      height: 82,
      borderRadius: 41,
      borderWidth: 2,
      borderStyle: 'dashed',
      borderColor: '#1DB954',
      alignItems: 'center',
      justifyContent: 'center',
      alignSelf: 'center',
      marginBottom: space.lg,
      backgroundColor: 'rgba(29,185,84,0.06)',
      overflow: 'hidden',
    },
    avatarImage: {
      width: '100%',
      height: '100%',
    },
    devFillBtn: {
      width: 32,
      height: 32,
      borderRadius: 16,
      alignItems: 'center',
      justifyContent: 'center',
      alignSelf: 'flex-end',
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surfaceVariant,
    },
    spacer: {
      height: space.lg,
    },
  });
